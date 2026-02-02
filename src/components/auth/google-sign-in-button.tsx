"use client";

import { Button } from "@/components/ui/button";
import { firebaseAuth } from "@/lib/firebase/client";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { toast } from "sonner";

export function GoogleSignInButton() {
  async function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); // 🔴 IMPORTANT

    try {
      const auth = firebaseAuth();
      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google");
    } catch (err: any) {
      // 🔁 Fallback to redirect if popup blocked
      if (err?.code === "auth/popup-blocked") {
        await signInWithRedirect(firebaseAuth(), new GoogleAuthProvider());
        return;
      }

      toast.error(err?.message ?? "Google sign-in failed");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onClick}
    >
      Continue with Google
    </Button>
  );
}

