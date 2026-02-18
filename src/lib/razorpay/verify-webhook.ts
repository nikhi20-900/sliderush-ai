import crypto from "crypto";

/**
 * Verify the signature of a Razorpay webhook payload
 * @see https://razorpay.com/docs/webhooks/validate-test/
 */
export function verifyWebhookSignature(
    body: string,
    signature: string,
    secret?: string
): boolean {
    const webhookSecret = secret || process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("RAZORPAY_WEBHOOK_SECRET not configured");
        return false;
    }

    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

/**
 * Verify a Razorpay payment signature (used after checkout)
 * @see https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration/#verify-payment-signature
 */
export function verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
        console.error("RAZORPAY_KEY_SECRET not configured");
        return false;
    }

    const generated = crypto
        .createHmac("sha256", keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(generated)
    );
}

/**
 * Verify a Razorpay subscription payment signature
 */
export function verifySubscriptionSignature(
    subscriptionId: string,
    paymentId: string,
    signature: string
): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
        console.error("RAZORPAY_KEY_SECRET not configured");
        return false;
    }

    const generated = crypto
        .createHmac("sha256", keySecret)
        .update(`${paymentId}|${subscriptionId}`)
        .digest("hex");

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(generated)
    );
}
