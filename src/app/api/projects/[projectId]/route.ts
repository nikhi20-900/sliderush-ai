import { firebaseAuth, firestore } from "@/lib/firebase/client";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

function requireUser() {
  const auth = firebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth not initialized");
  }
  const user = auth.currentUser;
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const user = requireUser();
  const db = firestore();
  if (!db) {
    return new NextResponse("Database not available", { status: 503 });
  }
  const ref = doc(collection(db, "projects"), projectId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().userId !== user.uid) {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.json({ id: snap.id, ...snap.data() });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const user = requireUser();
  const db = firestore();
  if (!db) {
    return new NextResponse("Database not available", { status: 503 });
  }
  const ref = doc(collection(db, "projects"), projectId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().userId !== user.uid) {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = await request.json();
  const allowed: Record<string, unknown> = {};
  if (typeof body.title === "string") allowed.title = body.title;
  if (typeof body.templateId === "string") allowed.templateId = body.templateId;
  allowed.updatedAt = serverTimestamp();

  await updateDoc(ref, allowed);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const user = requireUser();
  const db = firestore();
  if (!db) {
    return new NextResponse("Database not available", { status: 503 });
  }
  const ref = doc(collection(db, "projects"), projectId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().userId !== user.uid) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Soft delete for now to match spec
  await updateDoc(ref, {
    deletedAt: serverTimestamp(),
  });

  // Hard delete could be: await deleteDoc(ref);
  return NextResponse.json({ ok: true });
}

