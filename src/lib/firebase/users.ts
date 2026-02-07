import { firestore } from "@/lib/firebase/client";
import type { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export async function ensureUserDocument(user: FirebaseUser) {
  const db = firestore();
  if (!db) {
    console.warn("Firestore not available, skipping user document creation");
    return;
  }

  const ref = doc(db, "users", user.uid);
  
  try {
    // Try to get the document with source preference to prefer server
    const snap = await getDoc(ref);
    const now = serverTimestamp();

    if (!snap.exists()) {
      // Create new user document
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

    // Update existing user
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
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    
    // Handle "client offline" error - fallback to local storage/ignore
    if (firebaseError.code === "unavailable" || 
        firebaseError.message?.includes("client is offline")) {
      console.warn("Firestore unavailable, user document sync deferred");
      return;
    }
    
    // Log other errors but don't throw - auth should still work
    console.error("Error ensuring user document:", error);
  }
}

