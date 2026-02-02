"use client";

import { Auth } from "@/lib/firebase/client";
import { ensureUserDocument } from "@/lib/firebase/users";
import { useAuthStore } from "@/store/auth.store";
import { onAuthStateChanged } from "firebase/auth";
import * as React from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);

  React.useEffect(() => {
    const auth = Auth();
    return onAuthStateChanged(auth, (u) => {
      if (!u) {
        setUser(null);
        return;
      }
      setUser({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
      });
      // Fire-and-forget creation/update of Firestore user document
      void ensureUserDocument(u);
    });
  }, [setUser]);

  return <>{children}</>;
}

