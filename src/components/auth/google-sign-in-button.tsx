"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { firebaseAuth } from "@/lib/firebase/client";

export function GoogleSignInButton() {
  async function onClick() {
    try {
      const auth = firebaseAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google");
    } catch (err: any) {
      toast.error(err?.message ?? "Google sign-in failed");
    }
  }

  return (
    <Button type="button" variant="outline" className="w-full" onClick={onClick}>
      Continue with Google
    </Button>
  );
}

