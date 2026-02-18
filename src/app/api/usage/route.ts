import { NextResponse } from "next/server";
import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { PLAN_LIMITS } from "@/lib/usage/quota";

type PlanKey = keyof typeof PLAN_LIMITS;

export async function GET() {
  try {
    const auth = firebaseAuth();
    const user = auth?.currentUser;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = firestore();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    // Get user plan
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const plan: PlanKey = (userSnap.data()?.plan as PlanKey) || "free";

    // Get usage for current month
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const usageRef = doc(db, "users", user.uid, "usage", yearMonth);
    const usageSnap = await getDoc(usageRef);
    const usageData = usageSnap.data() || {};

    const limits = PLAN_LIMITS[plan];

    return NextResponse.json({
      generations: {
        used: usageData.generations || 0,
        limit: limits.generationsPerMonth,
      },
      exports: {
        used: usageData.exports || 0,
        limit: limits.exportsPerMonth,
      },
      rewrites: {
        used: usageData.rewrites || 0,
        limit: limits.rewritesPerMonth || 0,
      },
      imageRegens: {
        used: usageData.imageRegens || 0,
        limit: limits.imageRegensPerMonth || 0,
      },
    });

  } catch (error) {
    console.error("Usage fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}
