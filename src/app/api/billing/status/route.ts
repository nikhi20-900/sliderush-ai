import { NextResponse } from "next/server";
import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import type { BillingStatusResponse } from "@/types/billing";

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

        // Get user's plan from their profile
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        const plan = userData?.plan || "free";

        // Get active subscription if any
        const subsRef = collection(db, "subscriptions");
        const subsQuery = query(
            subsRef,
            where("userId", "==", user.uid),
            where("status", "in", ["active", "authenticated", "created"]),
            orderBy("createdAt", "desc"),
            limit(1)
        );
        const subsSnap = await getDocs(subsQuery);

        let subscription = null;
        let isActive = plan !== "free";
        let expiresAt = null;

        if (!subsSnap.empty) {
            const subData = subsSnap.docs[0].data();
            subscription = {
                id: subsSnap.docs[0].id,
                ...subData,
            } as import("@/types/billing").Subscription;
            expiresAt = subData.currentPeriodEnd || null;
        }

        const response: BillingStatusResponse = {
            plan,
            subscription,
            isActive,
            expiresAt,
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error("Billing status error:", error);
        return NextResponse.json(
            { error: "Failed to fetch billing status" },
            { status: 500 }
        );
    }
}
