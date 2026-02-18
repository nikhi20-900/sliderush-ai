import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { PLAN_LIMITS, PlanType } from "@/lib/usage/quota";

export type Feature =
  | "premium_templates"
  | "ai_rewrite"
  | "image_regen"
  | "panic_mode"
  | "branding"
  | "export_pdf"
  | "unlimited_slides";

export const FEATURE_INFO: Record<Feature, { name: string; description: string; planRequired: PlanType }> = {
  premium_templates: {
    name: "Premium Templates",
    description: "Access to premium presentation templates with advanced designs",
    planRequired: "pro",
  },
  ai_rewrite: {
    name: "AI Rewrite",
    description: "Rewrite slide content using AI to change tone, length, or style",
    planRequired: "pro",
  },
  image_regen: {
    name: "Image Regeneration",
    description: "Regenerate slide images using AI for better visuals",
    planRequired: "ultra",
  },
  panic_mode: {
    name: "Panic Mode",
    description: "Generate presentations in under 20 seconds for urgent needs",
    planRequired: "ultra",
  },
  branding: {
    name: "Custom Branding",
    description: "Add your organization name and logo to presentations",
    planRequired: "ultra",
  },
  export_pdf: {
    name: "PDF Export",
    description: "Export presentations as PDF documents",
    planRequired: "pro",
  },
  unlimited_slides: {
    name: "Unlimited Slides",
    description: "Create presentations with more than 12 slides",
    planRequired: "ultra",
  },
};

// Check if a user can access a specific feature
export async function canAccessFeature(userId: string, feature: Feature): Promise<boolean> {
  try {
    const db = getFirebaseDb();
    if (!db) {
      // Fail open - allow access if database is not available
      return true;
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // New users start on free plan
      return FEATURE_INFO[feature].planRequired === "free";
    }

    const userData = userSnap.data();
    const plan = (userData.plan as PlanType) || "free";

    // Ultra users can access everything
    if (plan === "ultra") {
      return true;
    }

    // Pro users can access pro and free features
    if (plan === "pro") {
      return FEATURE_INFO[feature].planRequired !== "ultra";
    }

    // Free users can only access free features
    return FEATURE_INFO[feature].planRequired === "free";
  } catch (error) {
    console.error("Error checking feature access:", error);
    // Fail open
    return true;
  }
}

// Get list of features accessible by plan
export function getAccessibleFeatures(plan: PlanType): Feature[] {
  if (plan === "ultra") {
    return Object.keys(FEATURE_INFO) as Feature[];
  }

  if (plan === "pro") {
    return (Object.keys(FEATURE_INFO) as Feature[]).filter(
      (feature) => FEATURE_INFO[feature].planRequired !== "ultra"
    );
  }

  // Free plan
  return (Object.keys(FEATURE_INFO) as Feature[]).filter(
    (feature) => FEATURE_INFO[feature].planRequired === "free"
  );
}

// Check if a template is premium
export function isTemplatePremium(templateId: string): boolean {
  const premiumTemplates = [
    "corporate",
    "creative",
    "startup",
    "minimal_pro",
    "academic_pro",
  ];
  return premiumTemplates.includes(templateId);
}

// Get upgrade message for a feature
export function getUpgradeMessage(feature: Feature): {
  title: string;
  message: string;
  buttonText: string;
} {
  const info = FEATURE_INFO[feature];
  
  if (info.planRequired === "ultra") {
    return {
      title: "Ultra Plan Required",
      message: `${info.name} is available on the Ultra plan. Upgrade to unlock this feature and more!`,
      buttonText: "Upgrade to Ultra",
    };
  }

  // Pro plan
  return {
    title: "Pro Plan Required",
    message: `${info.name} is available on the Pro plan. Upgrade to unlock this feature!`,
    buttonText: "Upgrade to Pro",
  };
}

// Check if slide count exceeds plan limit
export function canCreateSlides(plan: PlanType, slideCount: number): boolean {
  const limits = PLAN_LIMITS[plan];
  return slideCount <= limits.maxSlides;
}

