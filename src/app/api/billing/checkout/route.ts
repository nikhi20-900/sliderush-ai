import { NextResponse } from "next/server";
import { firebaseAuth, firestore } from "@/lib/firebase/client";
import { createSubscription, PLAN_CONFIG, PlanKey } from "@/lib/razorpay/client";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: Request) {
    try {
        const auth = firebaseAuth();
        const user = auth?.currentUser;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { planKey } = body as { planKey: PlanKey };

        if (!planKey || !PLAN_CONFIG[planKey]) {
            return NextResponse.json(
                { error: "Invalid plan. Must be 'pro' or 'ultra'." },
                { status: 400 }
            );
        }

        const db = firestore();
        if (!db) {
            return NextResponse.json({ error: "Database not available" }, { status: 503 });
        }

        // Check if user already has an active subscription
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        if (userData?.plan && userData.plan !== "free") {
            return NextResponse.json(
                { error: `You already have an active ${userData.plan} plan. Cancel it first to switch plans.` },
                { status: 409 }
            );
        }

        // Create Razorpay subscription
        const subscription = await createSubscription(
            planKey,
            userData?.razorpayCustomerId
        );

        // Store pending subscription in Firestore
        const subRef = doc(db, "subscriptions", subscription.id);
        await setDoc(subRef, {
            userId: user.uid,
            razorpaySubscriptionId: subscription.id,
            plan: planKey,
            status: "created",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        const config = PLAN_CONFIG[planKey];

        return NextResponse.json({
            subscriptionId: subscription.id,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID,
            planName: config.name,
            amount: config.priceMonthly,
        });

    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
