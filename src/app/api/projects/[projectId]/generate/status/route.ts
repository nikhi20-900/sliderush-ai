import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { NextResponse } from "next/server";

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

    // Get project
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists() || projectSnap.data().userId !== user.uid) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const project = projectSnap.data();

    // Check if slides have been generated
    const slidesRef = collection(db, "projects", projectId, "slides");
    const slidesQuery = query(slidesRef);
    const slidesSnap = await getDocs(slidesQuery);
    
    const slides = slidesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Determine status based on project state and slides
    let status = project.status || "draft";
    let stage = project.generationStage || null;
    let progress = project.generationProgress || 0;
    let error = project.generationError || null;

    // If slides exist and project is generating, mark as ready
    if (slides.length > 0 && status === "generating") {
      status = "ready";
      stage = "done";
      progress = 100;
    }

    return NextResponse.json({
      status,
      stage,
      progress,
      error,
      slidesCount: slides.length,
    });

  } catch (error) {
    console.error("Error getting generation status:", error);
    return NextResponse.json(
      { error: "Failed to get status" },
      { status: 500 }
    );
  }
}


