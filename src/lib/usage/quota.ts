import { getFirebaseDb } from "@/lib/firebase/client";
import { collection, doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

// Plan limits
export const PLAN_LIMITS = {
  free: {
    generationsPerMonth: 5,
    exportsPerMonth: 3,
    rewritesPerMonth: 10,
    imageRegensPerMonth: 5,
    canUsePanicMode: false,
    hasWatermark: true,
    maxSlides: 12,
  },
  pro: {
    generationsPerMonth: 50,
    exportsPerMonth: 100,
    rewritesPerMonth: 100,
    imageRegensPerMonth: 50,
    canUsePanicMode: false,
    hasWatermark: false,
    maxSlides: 25,
  },
  ultra: {
    generationsPerMonth: 999999,
    exportsPerMonth: 999999,
    rewritesPerMonth: 999999,
    imageRegensPerMonth: 999999,
    canUsePanicMode: true,
    hasWatermark: false,
    maxSlides: 50,
  },
};

export type PlanType = "free" | "pro" | "ultra";

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
  upgradeUrl?: string;
  currentCount?: number;
  limit?: number;
}

// Get user's plan and quota information
export async function getUserQuota(userId: string): Promise<{
  plan: PlanType;
  quota: {
    generationsUsed: number;
    exportsUsed: number;
    rewritesUsed: number;
    imageRegensUsed: number;
    periodStart: Date;
    periodEnd: Date;
  };
  limits: typeof PLAN_LIMITS.free;
}> {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Default to free plan for new users
    return {
      plan: "free",
      quota: {
        generationsUsed: 0,
        exportsUsed: 0,
        rewritesUsed: 0,
        imageRegensUsed: 0,
        periodStart: new Date(),
        periodEnd: getPeriodEnd(),
      },
      limits: PLAN_LIMITS.free,
    };
  }

  const userData = userSnap.data();
  const plan = (userData.plan as PlanType) || "free";
  const userQuota = userData.quota || {
    generationsUsed: 0,
    exportsUsed: 0,
    rewritesUsed: 0,
    imageRegensUsed: 0,
    periodStart: new Date(),
    periodEnd: getPeriodEnd(),
  };

  return {
    plan,
    quota: {
      generationsUsed: userQuota.generationsUsed || 0,
      exportsUsed: userQuota.exportsUsed || 0,
      rewritesUsed: userQuota.rewritesUsed || 0,
      imageRegensUsed: userQuota.imageRegensUsed || 0,
      periodStart: userQuota.periodStart?.toDate() || new Date(),
      periodEnd: userQuota.periodEnd?.toDate() || getPeriodEnd(),
    },
    limits: PLAN_LIMITS[plan],
  };
}

// Check if user can perform a generation
export async function checkGenerationQuota(userId: string): Promise<QuotaCheckResult> {
  try {
    const { plan, quota, limits } = await getUserQuota(userId);
    
    // Check if period has expired and needs reset
    if (new Date() > quota.periodEnd) {
      return { allowed: true }; // Will reset on next usage
    }

    if (quota.generationsUsed >= limits.generationsPerMonth) {
      return {
        allowed: false,
        reason: `You've reached your limit of ${limits.generationsPerMonth} generations per month on the ${plan} plan.`,
        upgradeUrl: "/pricing",
        currentCount: quota.generationsUsed,
        limit: limits.generationsPerMonth,
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Error checking generation quota:", error);
    // Fail open - allow the operation but log the error
    return { allowed: true };
  }
}

// Check if user can perform an export
export async function checkExportQuota(userId: string): Promise<QuotaCheckResult> {
  try {
    const { plan, quota, limits } = await getUserQuota(userId);
    
    if (new Date() > quota.periodEnd) {
      return { allowed: true };
    }

    if (quota.exportsUsed >= limits.exportsPerMonth) {
      return {
        allowed: false,
        reason: `You've reached your limit of ${limits.exportsPerMonth} exports per month on the ${plan} plan.`,
        upgradeUrl: "/pricing",
        currentCount: quota.exportsUsed,
        limit: limits.exportsPerMonth,
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Error checking export quota:", error);
    return { allowed: true };
  }
}

// Check if user can perform a rewrite
export async function checkRewriteQuota(userId: string): Promise<QuotaCheckResult> {
  try {
    const { plan, quota, limits } = await getUserQuota(userId);
    
    if (new Date() > quota.periodEnd) {
      return { allowed: true };
    }

    if (quota.rewritesUsed >= limits.rewritesPerMonth) {
      return {
        allowed: false,
        reason: `You've reached your limit of ${limits.rewritesPerMonth} rewrites per month on the ${plan} plan.`,
        upgradeUrl: "/pricing",
        currentCount: quota.rewritesUsed,
        limit: limits.rewritesPerMonth,
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Error checking rewrite quota:", error);
    return { allowed: true };
  }
}

// Check if user can use panic mode
export async function checkPanicModeQuota(userId: string): Promise<QuotaCheckResult> {
  try {
    const { plan, limits } = await getUserQuota(userId);
    
    if (!limits.canUsePanicMode) {
      return {
        allowed: false,
        reason: "Panic mode is only available on the Ultra plan.",
        upgradeUrl: "/pricing",
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Error checking panic mode quota:", error);
    return { allowed: true };
  }
}

// Increment usage counter
export async function incrementUsage(
  userId: string, 
  type: "generations" | "exports" | "rewrites" | "imageRegens",
  metadata?: Record<string, unknown>
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  const userRef = doc(db, "users", userId);
  
  // First check if we need to reset the period
  const { quota } = await getUserQuota(userId);
  const needsReset = new Date() > quota.periodEnd;

  if (needsReset) {
    // Reset the period and counters
    await updateDoc(userRef, {
      "quota.periodStart": serverTimestamp(),
      "quota.periodEnd": getPeriodTimestamp(),
      "quota.generationsUsed": type === "generations" ? 1 : 0,
      "quota.exportsUsed": type === "exports" ? 1 : 0,
      "quota.rewritesUsed": type === "rewrites" ? 1 : 0,
      "quota.imageRegensUsed": type === "imageRegens" ? 1 : 0,
      updatedAt: serverTimestamp(),
    });
  } else {
    // Increment the counter
    const field = `quota.${type}Used` as "quota.generationsUsed" | "quota.exportsUsed" | "quota.rewritesUsed" | "quota.imageRegensUsed";
    await updateDoc(userRef, {
      [field]: increment(1),
      updatedAt: serverTimestamp(),
    });
  }

  // Optionally log to usage_events collection for analytics
  try {
    const usageEventsRef = doc(collection(db, "usage_events"));
    await setDoc(usageEventsRef, {
      userId,
      type: type === "generations" ? "generate_deck" : type === "exports" ? "export_pptx" : "rewrite_slide",
      planAtTime: (await getUserQuota(userId)).plan,
      createdAt: serverTimestamp(),
      metadata: metadata || {},
    });
  } catch (eventError) {
    console.error("Failed to log usage event:", eventError);
    // Don't fail the main operation if event logging fails
  }
}

// Helper function to get period end (1 month from now)
function getPeriodEnd(): Date {
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  return now;
}

// Helper function to get period end as Firestore Timestamp
function getPeriodTimestamp() {
  const date = getPeriodEnd();
  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0,
    toDate: () => date,
    isEqual: (other: any) => other.seconds === Math.floor(date.getTime() / 1000),
  };
}

// Get usage summary for dashboard
export async function getUsageSummary(userId: string): Promise<{
  plan: PlanType;
  usage: {
    generations: { used: number; limit: number; percentage: number };
    exports: { used: number; limit: number; percentage: number };
    rewrites: { used: number; limit: number; percentage: number };
    imageRegens: { used: number; limit: number; percentage: number };
  };
  features: {
    panicMode: boolean;
    watermark: boolean;
    maxSlides: number;
  };
}> {
  const { plan, quota, limits } = await getUserQuota(userId);

  return {
    plan,
    usage: {
      generations: {
        used: quota.generationsUsed,
        limit: limits.generationsPerMonth,
        percentage: Math.round((quota.generationsUsed / limits.generationsPerMonth) * 100),
      },
      exports: {
        used: quota.exportsUsed,
        limit: limits.exportsPerMonth,
        percentage: Math.round((quota.exportsUsed / limits.exportsPerMonth) * 100),
      },
      rewrites: {
        used: quota.rewritesUsed,
        limit: limits.rewritesPerMonth,
        percentage: Math.round((quota.rewritesUsed / limits.rewritesPerMonth) * 100),
      },
      imageRegens: {
        used: quota.imageRegensUsed,
        limit: limits.imageRegensPerMonth,
        percentage: Math.round((quota.imageRegensUsed / limits.imageRegensPerMonth) * 100),
      },
    },
    features: {
      panicMode: limits.canUsePanicMode,
      watermark: limits.hasWatermark,
      maxSlides: limits.maxSlides,
    },
  };
}

