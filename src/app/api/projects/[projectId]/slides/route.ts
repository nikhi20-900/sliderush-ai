import { NextResponse } from "next/server";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";
import { firebaseAuth } from "@/lib/firebase/client";

export async function GET(
  _request: Request,
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

    const slidesRef = collection(db, "projects", projectId, "slides");
    const snapshot = await getDocs(slidesRef);
    
    const slides = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ slides });

  } catch (error) {
    console.error("Error fetching slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch slides" },
      { status: 500 }
    );
  }
}

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
    const { layout = "content", title = "", bullets = [] } = body;

    // Get current slide count to determine order
    const slidesRef = collection(db, "projects", projectId, "slides");
    const snapshot = await getDocs(slidesRef);
    const newOrder = snapshot.size;

    const slideRef = await addDoc(slidesRef, {
      order: newOrder,
      layout,
      title,
      bullets,
      speakerNotes: null,
      imageAssetId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json(
      { slideId: slideRef.id },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating slide:", error);
    return NextResponse.json(
      { error: "Failed to create slide" },
      { status: 500 }
    );
  }
}


