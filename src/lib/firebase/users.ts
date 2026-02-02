import { firestore } from "@/lib/firebase/client";
import type { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export async function ensureUserDocument(user: FirebaseUser) {
  const db = firestore();
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const now = serverTimestamp();

  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email ?? null,
      phone: user.phoneNumber ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      plan: "free",
      planStatus: "active",
      createdAt: now,
      updatedAt: now,
    });
    return;
  }

  // Light touch update of common fields + updatedAt
  await setDoc(
    ref,
    {
      email: user.email ?? null,
      phone: user.phoneNumber ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      updatedAt: now,
    },
    { merge: true }
  );
}

