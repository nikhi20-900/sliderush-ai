import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { clientEnv } from "@/lib/env";

function requireClientEnv() {
  if (!clientEnv) {
    throw new Error(
      "Missing Firebase env vars. Copy `env.example` to `.env.local` and fill NEXT_PUBLIC_FIREBASE_*."
    );
  }
  return clientEnv;
}

export function getFirebaseClientApp() {
  const env = requireClientEnv();
  if (getApps().length) return getApps()[0]!;
  return initializeApp({
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}

export const firebaseAuth = () => getAuth(getFirebaseClientApp());
export const firestore = () => getFirestore(getFirebaseClientApp());
export const storage = () => getStorage(getFirebaseClientApp());

