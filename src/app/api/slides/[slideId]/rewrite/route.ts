import { NextResponse } from "next/server";
import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { canAccessFeature } from "@/lib/features/gating";
import { checkRewriteQuota, incrementUsage } from "@/lib/usage/quota";
import { rewriteSlide, SlideContent } from "@/lib/openai/client";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slideId: string }> }
) {
  try {
    const { slideId } = await params;
    const auth = firebaseAuth();
    const user = auth?.currentUser;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { intent = "shorter", customPrompt, projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    // Check feature access (Pro plan required)
    const hasAccess = await canAccessFeature(user.uid, "ai_rewrite");
    if (!hasAccess) {
      return NextResponse.json({
        error: "AI Rewrite requires a Pro or Ultra plan.",
        upgradeRequired: true,
        feature: "ai_rewrite",
      }, { status: 403 });
    }

    // Check quota
    const quotaResult = await checkRewriteQuota(user.uid);
    if (!quotaResult.allowed) {
      return NextResponse.json({
        error: quotaResult.reason,
        upgradeUrl: quotaResult.upgradeUrl,
        currentCount: quotaResult.currentCount,
        limit: quotaResult.limit,
      }, { status: 403 });
    }

    const db = firestore();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    // Verify project ownership
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists() || projectSnap.data().userId !== user.uid) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch the slide
    const slideRef = doc(db, "projects", projectId, "slides", slideId);
    const slideSnap = await getDoc(slideRef);
    if (!slideSnap.exists()) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    const slideData = slideSnap.data();
    const currentContent: SlideContent = {
      title: slideData.title || "",
      bullets: slideData.bullets || [],
      speakerNotes: slideData.speakerNotes || undefined,
      layoutHint: slideData.layout || undefined,
      imageQuery: slideData.imageQuery || undefined,
    };

    // Call OpenAI rewrite
    const rewritten = await rewriteSlide(currentContent, intent, customPrompt);

    // Update the slide in Firestore
    await updateDoc(slideRef, {
      title: rewritten.title,
      bullets: rewritten.bullets,
      speakerNotes: rewritten.speakerNotes || null,
      updatedAt: serverTimestamp(),
    });

    // Track usage
    try {
      await incrementUsage(user.uid, "rewrites", {
        projectId,
        slideId,
        intent,
      });
    } catch (usageErr) {
      console.error("Failed to track rewrite usage:", usageErr);
    }

    return NextResponse.json({
      success: true,
      rewritten: {
        title: rewritten.title,
        bullets: rewritten.bullets,
        speakerNotes: rewritten.speakerNotes || null,
      },
    });

  } catch (error) {
    console.error("Error rewriting slide:", error);
    return NextResponse.json(
      { error: "Failed to rewrite slide" },
      { status: 500 }
    );
  }
}
