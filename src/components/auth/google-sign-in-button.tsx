"use client";

import { Button } from "@/components/ui/button";
import { firebaseAuth, isFirebaseConfigured, getFirebaseError } from "@/lib/firebase/client";
import type { AuthError, Auth as FirebaseAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

// Extend Button props to accept onClick
interface GoogleSignInButtonProps {
  className?: string;
  disabled?: boolean;
}

export function GoogleSignInButton({ className = "w-full h-11", disabled = false }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  async function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    
    if (isLoading || disabled) return;
    
    // Check if Firebase is configured first
    if (!isFirebaseConfigured()) {
      const error = getFirebaseError();
      toast.error(error?.message || "Firebase is not configured. Please add your credentials.");
      return;
    }
    
    setIsLoading(true);

    try {
      const auth = firebaseAuth();
      
      if (!auth) {
        throw new Error("Authentication service not available. Please check your Firebase configuration.");
      }
      
      const provider = new GoogleAuthProvider();
      
      // Add custom parameters to force account selection
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth as unknown as FirebaseAuth, provider);
      
      toast.success("Successfully signed in with Google!");
      console.log("Google sign-in successful:", result.user.email);
      
      // Redirect to dashboard after successful sign-in
      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error("Google sign-in error:", authError.code, authError.message);
      
      // Handle specific Firebase Auth errors
      switch (authError.code) {
        case "auth/popup-blocked":
          toast.error("Popup was blocked. Please allow popups for this site or click the button again.");
          break;
        case "auth/cancelled-popup-request":
          // User cancelled, do nothing
          break;
        case "auth/operation-not-allowed":
          toast.error("Google sign-in is not enabled. Please go to Firebase Console > Authentication > Sign-in method and enable Google.");
          break;
        case "auth/unauthorized-domain":
          toast.error("This domain is not authorized for OAuth sign-in. Please add localhost to Firebase Console > Authentication > Sign-in method > Authorized domains.");
          break;
        case "auth/network-request-failed":
          toast.error("Network error. Please check your connection and try again.");
          break;
        case "auth/user-disabled":
          toast.error("This account has been disabled. Please contact support.");
          break;
        case "auth/invalid-credential":
          toast.error("Invalid credentials. This might mean your API key is invalid or the OAuth consent screen is not configured.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email address.");
          break;
        default:
          // Generic error handling
          if (authError.message?.includes("popup")) {
            toast.error("Sign-in popup was closed or blocked.");
          } else if (authError.message?.includes("configuration")) {
            toast.error("Firebase configuration error. Please check your .env.local file.");
          } else {
            toast.error("Could not sign in. Please try again or contact support.");
          }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={className}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </>
      )}
    </Button>
  );
}

