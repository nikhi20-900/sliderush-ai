export type Plan = "free" | "pro" | "ultra";

export interface Subscription {
    id: string;
    userId: string;
    razorpaySubscriptionId: string;
    razorpayCustomerId?: string;
    plan: Plan;
    status: "created" | "authenticated" | "active" | "paused" | "halted" | "cancelled" | "completed" | "expired";
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelledAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BillingEvent {
    id: string;
    userId: string;
    type: "subscription_created" | "subscription_activated" | "subscription_charged" | "subscription_cancelled" | "subscription_completed" | "payment_failed";
    razorpayEventId: string;
    razorpayPaymentId?: string;
    amount?: number;
    currency?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}

export interface CheckoutRequest {
    planKey: "pro" | "ultra";
}

export interface CheckoutResponse {
    subscriptionId: string;
    razorpayKeyId: string;
    planName: string;
    amount: number;
}

export interface BillingStatusResponse {
    plan: Plan;
    subscription: Subscription | null;
    isActive: boolean;
    expiresAt: string | null;
}
