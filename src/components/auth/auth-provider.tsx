"use client";

import { Auth, getFirebaseError, isFirebaseConfigured } from "@/lib/firebase/client";
import { ensureUserDocument } from "@/lib/firebase/users";
import { useAuthStore } from "@/store/auth.store";
import { onAuthStateChanged, type Auth as FirebaseAuth } from "firebase/auth";
import * as React from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setIsLoading } = useAuthStore();
  const [configError, setConfigError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      const error = getFirebaseError();
      setConfigError(error?.message || "Firebase not configured");
      setIsLoading(false);
      return;
    }

    const auth = Auth();
    
    if (!auth) {
      setConfigError("Authentication service not available");
      setIsLoading(false);
      return;
    }
    
    // First, set loading to true while we check auth state
    setIsLoading(true);
    setConfigError(null);
    
    const unsubscribe = onAuthStateChanged(auth as unknown as FirebaseAuth, (u) => {
      if (!u) {
        setUser(null);
        setIsLoading(false);
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
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [setUser, setIsLoading]);

  // Show error if Firebase is not configured
  if (configError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-red-600 mb-2">
            Firebase Not Configured
          </h1>
          <p className="text-gray-600 mb-4">
            {configError}
          </p>
          <p className="text-sm text-gray-500">
            Please add your Firebase configuration to <code>.env.local</code>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

