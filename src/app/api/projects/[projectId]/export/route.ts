import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
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

    // Verify project ownership
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists() || projectSnap.data().userId !== user.uid) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const project = projectSnap.data();

    // In a real implementation, you would:
    // 1. Check user plan and quotas
    // 2. Generate the PPTX using PptxGenJS
    // 3. Upload to Firebase Storage
    // 4. Update usage counters
    // 5. Return the download URL

    // For MVP, return a placeholder response
    // The actual PptxGenJS implementation would be in lib/pptx/build-deck.ts
    
    // Simulate export
    const mockDownloadUrl = `/api/export/${projectId}.${format}`;

    // Update project with last exported timestamp
    await updateDoc(projectRef, {
      lastExportedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      downloadUrl: mockDownloadUrl,
      format,
      watermarked: project.plan === "free",
    });

  } catch (error) {
    console.error("Error exporting presentation:", error);
    return NextResponse.json(
      { error: "Failed to export presentation" },
      { status: 500 }
    );
  }
}


