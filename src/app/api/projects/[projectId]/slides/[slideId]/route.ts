import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; slideId: string }> }
) {
  try {
    const { projectId, slideId } = await params;
    const auth = firebaseAuth();
    const user = auth?.currentUser;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = firestore();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const slideRef = doc(db, "projects", projectId, "slides", slideId);
    const slideSnap = await getDoc(slideRef);

    if (!slideSnap.exists()) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json({ id: slideSnap.id, ...slideSnap.data() });

  } catch (error) {
    console.error("Error fetching slide:", error);
    return NextResponse.json(
      { error: "Failed to fetch slide" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; slideId: string }> }
) {
  try {
    const { projectId, slideId } = await params;
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
    const { title, bullets, speakerNotes, layout, imageAssetId } = body;

    const slideRef = doc(db, "projects", projectId, "slides", slideId);
    
    const updates: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (title !== undefined) updates.title = title;
    if (bullets !== undefined) updates.bullets = bullets;
    if (speakerNotes !== undefined) updates.speakerNotes = speakerNotes;
    if (layout !== undefined) updates.layout = layout;
    if (imageAssetId !== undefined) updates.imageAssetId = imageAssetId;

    await updateDoc(slideRef, updates);

    // Also update project updatedAt
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating slide:", error);
    return NextResponse.json(
      { error: "Failed to update slide" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; slideId: string }> }
) {
  try {
    const { projectId, slideId } = await params;
    const auth = firebaseAuth();
    const user = auth?.currentUser;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = firestore();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const slideRef = doc(db, "projects", projectId, "slides", slideId);
    await deleteDoc(slideRef);

    // Update project updatedAt
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting slide:", error);
    return NextResponse.json(
      { error: "Failed to delete slide" },
      { status: 500 }
    );
  }
}
