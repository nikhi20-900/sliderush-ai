import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { demoProjects, isDemoMode, nextDemoProjectId } from "@/lib/demo-store";
import { addDoc, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

// NOTE: This is a simple client-side authenticated API using Firebase client SDK.
// In production you'd normally verify ID tokens server-side, but for now we rely
// on the currently logged-in user from the client.

export async function GET() {
  // Check for demo mode
  if (isDemoMode()) {
    const userId = "demo-user";
    const projects = Array.from(demoProjects.values())
      .filter((p) => p.userId === userId && !p.deletedAt)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return NextResponse.json({ projects, demoMode: true });
  }

  const db = firestore();
  if (!db) {
    return new NextResponse("Database not available", { status: 503 });
  }

  const auth = firebaseAuth();
  if (!auth) {
    return new NextResponse("Auth not available", { status: 503 });
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const projectsRef = collection(db, "projects");
  const q = query(
    projectsRef,
    where("userId", "==", currentUser.uid),
    where("deletedAt", "==", null),
    orderBy("updatedAt", "desc")
  );
  const snap = await getDocs(q);

  const projects = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { topic, slideCount, templateId, title } = body ?? {};
  if (!topic || !slideCount || !templateId) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  const now = new Date();

  // Check for demo mode
  if (isDemoMode()) {
    const userId = "demo-user";
    const projectId = nextDemoProjectId();

    const project = {
      id: projectId,
      userId,
      title: title || topic,
      topic,
      subject: body.subject ?? null,
      audience: body.audience ?? null,
      tone: body.tone ?? null,
      slideCount,
      templateId,
      status: "draft",
      generationStage: null,
      generationProgress: null,
      generationError: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      lastExportedAt: null,
      deletedAt: null,
    };

    demoProjects.set(projectId, project);
    return NextResponse.json({ projectId, demoMode: true }, { status: 201 });
  }

  const db = firestore();
  if (!db) {
    return new NextResponse("Database not available", { status: 503 });
  }

  const auth = firebaseAuth();
  if (!auth) {
    return new NextResponse("Auth not available", { status: 503 });
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const projectsRef = collection(db, "projects");
  const docRef = await addDoc(projectsRef, {
    userId: currentUser.uid,
    title: title || topic,
    topic,
    subject: body.subject ?? null,
    audience: body.audience ?? null,
    tone: body.tone ?? null,
    slideCount,
    templateId,
    status: "draft",
    generationStage: null,
    generationProgress: null,
    generationError: null,
    createdAt: now,
    updatedAt: now,
    lastExportedAt: null,
    deletedAt: null,
  });

  return NextResponse.json({ projectId: docRef.id }, { status: 201 });
}

