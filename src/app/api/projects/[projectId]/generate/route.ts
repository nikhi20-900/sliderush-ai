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
    const { mode = "normal" } = body;

    // Verify project ownership
    const projectRef = doc(db, "projects", projectId);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists() || projectDoc.data().userId !== user.uid) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update project status to generating
    await updateDoc(projectRef, {
      status: "generating",
      generationStage: "outline",
      generationProgress: 0,
      generationError: null,
      updatedAt: serverTimestamp(),
    });

    // Start generation process (in production, this would be a background job)
    // For now, we'll return immediately and let client poll for status
    
    // In a real implementation, you would:
    // 1. Queue the job in a task queue (Inngest, Trigger.dev, etc.)
    // 2. Or spawn a serverless function
    // 3. Or use WebSockets for real-time updates
    
    // For MVP, we'll simulate the generation by immediately returning
    // The actual generation would happen in the status endpoint or a background worker
    
    return NextResponse.json({ 
      status: "started",
      message: "Generation started"
    });

  } catch (error) {
    console.error("Error starting generation:", error);
    return NextResponse.json(
      { error: "Failed to start generation" },
      { status: 500 }
    );
  }
}


