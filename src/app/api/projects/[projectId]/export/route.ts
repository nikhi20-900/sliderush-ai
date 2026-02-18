import { canAccessFeature } from "@/lib/features/gating";
import { firebaseAuth, firestore, getFirebaseStorage } from "@/lib/firebase/client";
import { generateHTMLContent } from "@/lib/pdf/generate";
import { buildDeck, ProjectData, SlideData } from "@/lib/pptx/build-deck";
import { checkExportQuota, incrementUsage } from "@/lib/usage/quota";
import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const auth = firebaseAuth();
    const user = auth?.currentUser;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = firestore();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const body = await request.json();
    const { format = "pptx" } = body;

    // Supported formats
    const supportedFormats = ["pptx", "pdf"];
    if (!supportedFormats.includes(format)) {
      return NextResponse.json({
        error: `Format ${format} is not supported. Supported formats: ${supportedFormats.join(", ")}`
      }, { status: 400 });
    }

    // Check export quota
    const quotaResult = await checkExportQuota(user.uid);
    if (!quotaResult.allowed) {
      return NextResponse.json({
        error: quotaResult.reason,
        upgradeUrl: quotaResult.upgradeUrl,
        currentCount: quotaResult.currentCount,
        limit: quotaResult.limit,
      }, { status: 403 });
    }

    // Verify project ownership
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists() || projectSnap.data().userId !== user.uid) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const project = projectSnap.data();

    // Fetch slides ordered by their order field
    const slidesRef = collection(db, "projects", projectId, "slides");
    const slidesQuery = query(slidesRef, orderBy("order", "asc"));
    const slidesSnap = await getDocs(slidesQuery);

    const slides: SlideData[] = slidesSnap.docs.map((slideDoc) => ({
      id: slideDoc.id,
      order: slideDoc.data().order || 0,
      layout: slideDoc.data().layout || "content",
      title: slideDoc.data().title || "",
      bullets: slideDoc.data().bullets || [],
      speakerNotes: slideDoc.data().speakerNotes || undefined,
      imageAssetId: slideDoc.data().imageAssetId || undefined,
      imageUrl: slideDoc.data().imageUrl || undefined,
    }));

    // Get user plan from Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    let isFreeTier = true;
    let userPlan = "free";

    if (userSnap.exists()) {
      const userData = userSnap.data();
      userPlan = userData.plan || "free";
      isFreeTier = userPlan === "free";
    }

    // Check feature access for PDF (Pro plan required)
    if (format === "pdf") {
      const hasAccess = await canAccessFeature(user.uid, "export_pdf");
      if (!hasAccess) {
        return NextResponse.json({
          error: "PDF export requires a Pro or Ultra plan",
          upgradeRequired: true,
          feature: "export_pdf",
        }, { status: 403 });
      }
    }

    // Build the presentation based on format
    const projectData: ProjectData = {
      id: projectId,
      title: project.title || project.topic,
      topic: project.topic,
      templateId: project.templateId || "modern",
    };

    let downloadUrl: string;
    let exportedFormat: string;
    let watermarked: boolean;

    if (format === "pptx") {
      // Build the PPTX
      const pptxBuffer = await buildDeck({
        project: projectData,
        slides,
        isFreeTier,
        userName: user.displayName || undefined,
        orgName: project.theme?.branding?.orgName || undefined,
      });

      // Upload to Firebase Storage
      const storage = getFirebaseStorage();
      const timestamp = Date.now();
      const exportRef = ref(storage, `users/${user.uid}/exports/${projectId}-${timestamp}.pptx`);
      await uploadBytes(exportRef, pptxBuffer);
      downloadUrl = await getDownloadURL(exportRef);
      exportedFormat = "pptx";
      watermarked = isFreeTier;

    } else if (format === "pdf") {
      // Generate PDF using HTML
      const htmlContent = generateHTMLContent(projectData, slides, isFreeTier);

      // For PDF, we'll return the HTML content as base64
      // The client will use browser's print functionality to save as PDF
      // This is a lightweight approach that works in all browsers

      const storage = getFirebaseStorage();
      const timestamp = Date.now();
      const exportRef = ref(storage, `users/${user.uid}/exports/${projectId}-${timestamp}.html`);
      const htmlBuffer = Buffer.from(htmlContent);
      await uploadBytes(exportRef, htmlBuffer);
      downloadUrl = await getDownloadURL(exportRef);
      exportedFormat = "pdf";
      watermarked = isFreeTier;
    } else {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    // Update project with last exported timestamp
    await updateDoc(projectRef, {
      lastExportedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Track export in usage events
    try {
      await incrementUsage(user.uid, "exports", {
        projectId,
        format: exportedFormat,
        watermarked,
      });
    } catch (usageError) {
      console.error("Failed to track usage:", usageError);
      // Don't fail the export if usage tracking fails
    }

    return NextResponse.json({
      downloadUrl,
      format: exportedFormat,
      watermarked,
    });

  } catch (error) {
    console.error("Error exporting presentation:", error);
    return NextResponse.json(
      { error: "Failed to export presentation" },
      { status: 500 }
    );
  }
}


