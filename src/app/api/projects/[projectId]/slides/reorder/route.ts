import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { doc, getDoc, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PATCH(
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
    const { slideIds } = body;

    if (!Array.isArray(slideIds) || slideIds.length === 0) {
      return NextResponse.json({ error: "slideIds array is required" }, { status: 400 });
    }

    // Verify project ownership
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists() || projectSnap.data().userId !== user.uid) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update slide orders using batch
    const batch = writeBatch(db);

    for (let i = 0; i < slideIds.length; i++) {
      const slideId = slideIds[i];
      const slideRef = doc(db, "projects", projectId, "slides", slideId);
      batch.update(slideRef, {
        order: i,
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();

    // Update project timestamp
    await updateDoc(projectRef, {
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error reordering slides:", error);
    return NextResponse.json(
      { error: "Failed to reorder slides" },
      { status: 500 }
    );
  }
}
