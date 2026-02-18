import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { canAccessFeature, isTemplatePremium } from "@/lib/features/gating";
import { demoProjects, demoSlides, isDemoMode } from "@/lib/demo-store";
import { generateOutline, generatePanicDeck, generateSlideContent } from "@/lib/openai/client";
import { searchPhotos } from "@/lib/unsplash/client";
import { checkGenerationQuota, checkPanicModeQuota, incrementUsage } from "@/lib/usage/quota";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const auth = firebaseAuth();
    const user = auth?.currentUser;

    const body = await request.json();
    const { mode = "normal" } = body;

    // Get project from demo storage or Firestore
    let project = null;

    if (isDemoMode() || !user) {
      project = demoProjects.get(projectId);
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
    } else {
      const db = firestore();
      if (!db) {
        return NextResponse.json({ error: "Database not available" }, { status: 503 });
      }

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // --- Quota & Feature Gating Checks ---

      // 1. Check generation quota
      const quotaResult = await checkGenerationQuota(user.uid);
      if (!quotaResult.allowed) {
        return NextResponse.json({
          error: quotaResult.reason,
          upgradeUrl: quotaResult.upgradeUrl,
          currentCount: quotaResult.currentCount,
          limit: quotaResult.limit,
        }, { status: 403 });
      }

      // 2. Check panic mode access (Ultra plan only)
      if (mode === "panic") {
        const panicResult = await checkPanicModeQuota(user.uid);
        if (!panicResult.allowed) {
          return NextResponse.json({
            error: panicResult.reason,
            upgradeUrl: panicResult.upgradeUrl,
          }, { status: 403 });
        }
      }

      const projectRef = doc(db, "projects", projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists() || projectSnap.data().userId !== user.uid) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      project = projectSnap.data();

      // 3. Check premium template access
      if (isTemplatePremium(project.templateId)) {
        const hasTemplateAccess = await canAccessFeature(user.uid, "premium_templates");
        if (!hasTemplateAccess) {
          return NextResponse.json({
            error: "This template requires a Pro or Ultra plan.",
            upgradeUrl: "/pricing",
            feature: "premium_templates",
          }, { status: 403 });
        }
      }
    }

    // Perform the generation
    try {
      let slides: any[] = [];

      if (mode === "panic") {
        // PANIC MODE: Single-pass generation — no image fetch, maximum speed
        const panicSlides = await generatePanicDeck(
          project.topic,
          project.slideCount || 6,
          project.templateId,
          project.audience,
          project.tone
        );

        slides = panicSlides.map((content, i) => ({
          id: uuidv4(),
          order: i,
          title: content.title,
          bullets: content.bullets || [],
          speakerNotes: null,
          imageUrl: null,
          imageQuery: content.imageQuery || null,
          layout: content.layoutHint || "content",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      } else {
        // NORMAL MODE: Two-pass generation (outline → content → images)
        const outline = await generateOutline(
          project.topic,
          project.slideCount,
          project.templateId,
          project.audience,
          project.tone
        );

        // Step 2: Generate content for each slide
        for (let i = 0; i < outline.slides.length; i++) {
          const slideOutline = outline.slides[i];

          // Generate slide content
          const content = await generateSlideContent(slideOutline);

          // Find an image for the slide
          let imageUrl = null;
          if (slideOutline.imageQuery || content.imageQuery) {
            const query = slideOutline.imageQuery || content.imageQuery;
            const searchResult = await searchPhotos(query || "", { perPage: 1 });
            if (searchResult.results.length > 0) {
              imageUrl = searchResult.results[0].urls.regular;
            }
          }

          slides.push({
            id: uuidv4(),
            order: i,
            title: content.title || slideOutline.title,
            bullets: content.bullets || slideOutline.keyPoints,
            speakerNotes: content.speakerNotes || null,
            imageUrl: imageUrl,
            imageQuery: slideOutline.imageQuery || content.imageQuery || null,
            layout: content.layoutHint || slideOutline.layoutHint || "content_image_right",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      // Store slides
      if (isDemoMode() || !user) {
        demoSlides.set(projectId, slides);

        demoProjects.set(projectId, {
          ...project,
          status: "ready",
          generationStage: "done",
          generationProgress: 100,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Store in Firestore
        const db = firestore();
        const projectRef = doc(db!, "projects", projectId);
        await updateDoc(projectRef, {
          status: "ready",
          generationStage: "done",
          generationProgress: 100,
          updatedAt: serverTimestamp(),
        });

        // Track usage
        try {
          await incrementUsage(user.uid, "generations", {
            projectId,
            mode,
            slideCount: slides.length,
          });
        } catch (usageErr) {
          console.error("Failed to track generation usage:", usageErr);
        }
      }

      return NextResponse.json({
        status: "ready",
        slidesCount: slides.length,
        demoMode: isDemoMode(),
        message: "Generation completed successfully"
      });

    } catch (genError) {
      console.error("Generation error:", genError);

      // Update project status to error
      if (isDemoMode() || !user) {
        demoProjects.set(projectId, {
          ...project,
          status: "error",
          generationStage: "failed",
          generationProgress: 0,
          generationError: genError instanceof Error ? genError.message : "Generation failed",
          updatedAt: new Date().toISOString(),
        });
      } else {
        const db = firestore();
        const projectRef = doc(db!, "projects", projectId);
        await updateDoc(projectRef, {
          status: "error",
          generationStage: "failed",
          generationError: genError instanceof Error ? genError.message : "Generation failed",
          updatedAt: serverTimestamp(),
        });
      }

      return NextResponse.json(
        { error: "Generation failed" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error starting generation:", error);
    return NextResponse.json(
      { error: "Failed to start generation" },
      { status: 500 }
    );
  }
}

