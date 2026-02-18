// eslint-disable-next-line @typescript-eslint/no-require-imports
const Razorpay = require("razorpay");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let instance: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRazorpayInstance(): any {
    if (instance) return instance;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error(
            "Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET environment variables"
        );
    }

    instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });

    return instance;
}

// Plan IDs should match Razorpay subscription plan IDs
export const PLAN_CONFIG = {
    pro: {
        razorpayPlanId: process.env.RAZORPAY_PRO_PLAN_ID || "",
        name: "Pro",
        priceMonthly: 299, // INR
        features: [
            "50 generations/month",
            "100 exports/month",
            "AI Rewrite",
            "PDF Export",
            "No watermark",
        ],
    },
    ultra: {
        razorpayPlanId: process.env.RAZORPAY_ULTRA_PLAN_ID || "",
        name: "Ultra",
        priceMonthly: 599, // INR
        features: [
            "Unlimited generations",
            "Unlimited exports",
            "AI Rewrite",
            "Panic Mode",
            "Image Regeneration",
            "Custom Branding",
        ],
    },
} as const;

export type PlanKey = keyof typeof PLAN_CONFIG;

/**
 * Create a Razorpay subscription for a user
 */
export async function createSubscription(
    planKey: PlanKey,
    customerId?: string
) {
    const razorpay = getRazorpayInstance();
    const config = PLAN_CONFIG[planKey];

    if (!config.razorpayPlanId) {
        throw new Error(`Razorpay plan ID not configured for plan: ${planKey}`);
    }

    const options: Record<string, unknown> = {
        plan_id: config.razorpayPlanId,
        total_count: 12, // 12 months
        quantity: 1,
    };

    if (customerId) {
        options.customer_id = customerId;
    }

    const subscription = await razorpay.subscriptions.create(options);
    return subscription;
}

/**
 * Fetch a subscription by its ID
 */
export async function getSubscription(subscriptionId: string) {
    const razorpay = getRazorpayInstance();
    return await razorpay.subscriptions.fetch(subscriptionId);
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
    subscriptionId: string,
    cancelAtEnd: boolean = true
) {
    const razorpay = getRazorpayInstance();
    return await razorpay.subscriptions.cancel(subscriptionId, cancelAtEnd);
}
