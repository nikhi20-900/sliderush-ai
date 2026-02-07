import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth as FirebaseAuthType } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Client-side check
const isClient = typeof window !== "undefined";

// Build Firebase config from environment variables
function getFirebaseConfig(): Record<string, string> | null {
  if (!isClient) return null;
  
  // Get values from environment
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  
  // Check if we have the essential values
  if (!apiKey || !authDomain || !projectId) {
    return null;
  }
  
  return {
    apiKey: apiKey!,
    authDomain: authDomain!,
    projectId: projectId!,
    storageBucket: storageBucket || "",
    messagingSenderId: messagingSenderId || "",
    appId: appId || "",
  };
}

// Singleton pattern
let _firebaseApp: FirebaseApp | null = null;
let _authInstance: FirebaseAuthType | null = null;
let _dbInstance: Firestore | null = null;
let _storageInstance: FirebaseStorage | null = null;
let _initializationAttempted = false;
let _initializationError: Error | null = null;

function initializeFirebase(): FirebaseApp | null {
  if (!isClient || _initializationAttempted) {
    return _firebaseApp;
  }
  
  _initializationAttempted = true;
  
  const config = getFirebaseConfig();
  
  if (!config) {
    // Don't show error during SSR - will be checked on client
    return null;
  }
  
  try {
    if (getApps().length > 0) {
      _firebaseApp = getApp();
    } else {
      _firebaseApp = initializeApp(config);
    }
    return _firebaseApp;
  } catch (error) {
    _initializationError = error as Error;
    console.error("Failed to initialize Firebase:", error);
    return null;
  }
}

// Helper function to check if Firebase is configured
export function isFirebaseConfigured(): boolean {
  if (!isClient) return false;
  const config = getFirebaseConfig();
  return config !== null;
}

// Get initialization error for debugging
export function getFirebaseError(): Error | null {
  return _initializationError;
}

export function getFirebaseApp(): FirebaseApp | null {
  // Only try to initialize on client side
  if (!isClient) return null;
  return initializeFirebase();
}

export function getFirebaseAuth(): FirebaseAuthType {
  if (!_authInstance) {
    const app = getFirebaseApp();
    if (!app) {
      throw new Error("Firebase app not initialized. Please check your .env.local configuration.");
    }
    _authInstance = getAuth(app);
  }
  return _authInstance;
}

export function getFirebaseDb(): Firestore {
  if (!_dbInstance) {
    const app = getFirebaseApp();
    if (!app) {
      throw new Error("Firebase app not initialized. Please check your .env.local configuration.");
    }
    _dbInstance = getFirestore(app);
  }
  return _dbInstance;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!_storageInstance) {
    const app = getFirebaseApp();
    if (!app) {
      throw new Error("Firebase app not initialized. Please check your .env.local configuration.");
    }
    _storageInstance = getStorage(app);
  }
  return _storageInstance;
}

// Compatibility functions for existing code
export const firebaseAuth = () => {
  try {
    return getFirebaseAuth();
  } catch {
    return null;
  }
};

export const firestore = () => {
  try {
    return getFirebaseDb();
  } catch {
    return null;
  }
};

export const Auth = () => {
  return firebaseAuth();
};
