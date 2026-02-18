import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay/verify-webhook";
import { firestore } from "@/lib/firebase/client";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where, serverTimestamp } from "firebase/firestore";

// Razorpay sends webhooks as POST requests
export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = request.headers.get("x-razorpay-signature");

        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        // Verify webhook signature
        const isValid = verifyWebhookSignature(body, signature);
        if (!isValid) {
            console.error("Invalid Razorpay webhook signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const event = JSON.parse(body);
        const eventType = event.event;
        const payload = event.payload;

        const db = firestore();
        if (!db) {
            return NextResponse.json({ error: "Database not available" }, { status: 503 });
        }

        // Log the billing event
        const eventRef = doc(collection(db, "billing_events"));
        await setDoc(eventRef, {
            type: eventType,
            razorpayEventId: event.event_id || event.id,
            payload: JSON.stringify(payload),
            createdAt: serverTimestamp(),
        });

        switch (eventType) {
            case "subscription.activated":
            case "subscription.charged": {
                const subscription = payload.subscription?.entity;
                if (!subscription) break;

                // Find the subscription in our database
                const subsRef = collection(db, "subscriptions");
                const subsQuery = query(
                    subsRef,
                    where("razorpaySubscriptionId", "==", subscription.id)
                );
                const subsSnap = await getDocs(subsQuery);

                if (!subsSnap.empty) {
                    const subDoc = subsSnap.docs[0];
                    const subData = subDoc.data();

                    // Update subscription status
                    await updateDoc(subDoc.ref, {
                        status: subscription.status || "active",
                        currentPeriodStart: subscription.current_start
                            ? new Date(subscription.current_start * 1000).toISOString()
                            : null,
                        currentPeriodEnd: subscription.current_end
                            ? new Date(subscription.current_end * 1000).toISOString()
                            : null,
                        updatedAt: serverTimestamp(),
                    });

                    // Update user's plan
                    const userRef = doc(db, "users", subData.userId);
                    await updateDoc(userRef, {
                        plan: subData.plan,
                        subscriptionId: subDoc.id,
                        updatedAt: serverTimestamp(),
                    });
                }
                break;
            }

            case "subscription.cancelled":
            case "subscription.completed":
            case "subscription.expired": {
                const subscription = payload.subscription?.entity;
                if (!subscription) break;

                const subsRef = collection(db, "subscriptions");
                const subsQuery = query(
                    subsRef,
                    where("razorpaySubscriptionId", "==", subscription.id)
                );
                const subsSnap = await getDocs(subsQuery);

                if (!subsSnap.empty) {
                    const subDoc = subsSnap.docs[0];
                    const subData = subDoc.data();

                    // Update subscription status
                    await updateDoc(subDoc.ref, {
                        status: subscription.status || eventType.split(".")[1],
                        cancelledAt: eventType.includes("cancelled")
                            ? serverTimestamp()
                            : null,
                        updatedAt: serverTimestamp(),
                    });

                    // Downgrade user to free plan
                    const userRef = doc(db, "users", subData.userId);
                    await updateDoc(userRef, {
                        plan: "free",
                        subscriptionId: null,
                        updatedAt: serverTimestamp(),
                    });
                }
                break;
            }

            case "payment.failed": {
                const payment = payload.payment?.entity;
                if (!payment) break;

                console.error("Payment failed:", payment.id, payment.error_description);
                // Could send email notification here
                break;
            }

            default:
                console.log("Unhandled Razorpay webhook event:", eventType);
        }

        // Always return 200 to acknowledge receipt
        return NextResponse.json({ status: "ok" });

    } catch (error) {
        console.error("Webhook processing error:", error);
        // Return 200 anyway to prevent Razorpay retries for parse errors
        return NextResponse.json({ status: "error", message: "Processing failed" });
    }
}
