"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
    User,
    CreditCard,
    BarChart3,
    Shield,
    Loader2,
    LogOut,
    Crown,
    Zap,
    ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface UsageSummary {
    generations: { used: number; limit: number };
    exports: { used: number; limit: number };
    rewrites: { used: number; limit: number };
    imageRegens: { used: number; limit: number };
}

interface BillingStatus {
    plan: string;
    subscription: { status: string; currentPeriodEnd?: string } | null;
    isActive: boolean;
    expiresAt: string | null;
}

function UsageBar({ label, used, limit }: { label: string; used: number; limit: number }) {
    const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
    const isUnlimited = limit >= 999999;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">{label}</span>
                <span className="font-medium text-neutral-900">
                    {used} / {isUnlimited ? "∞" : limit}
                </span>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${percentage > 90
                            ? "bg-red-500"
                            : percentage > 70
                                ? "bg-amber-500"
                                : "bg-primary"
                        }`}
                    style={{ width: isUnlimited ? "5%" : `${percentage}%` }}
                />
            </div>
        </div>
    );
}

function PlanBadge({ plan }: { plan: string }) {
    const config: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        free: { label: "Free", color: "bg-neutral-100 text-neutral-600", icon: null },
        pro: { label: "Pro", color: "bg-primary/10 text-primary", icon: <Crown className="w-3.5 h-3.5" /> },
        ultra: { label: "Ultra", color: "bg-amber-100 text-amber-700", icon: <Zap className="w-3.5 h-3.5" /> },
    };

    const { label, color, icon } = config[plan] || config.free;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${color}`}>
            {icon}
            {label}
        </span>
    );
}

export default function AccountPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [billing, setBilling] = useState<BillingStatus | null>(null);
    const [usage, setUsage] = useState<UsageSummary | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [billingRes, usageRes] = await Promise.all([
                    fetch("/api/billing/status"),
                    fetch("/api/usage"),
                ]);

                if (billingRes.ok) {
                    setBilling(await billingRes.json());
                }
                if (usageRes.ok) {
                    setUsage(await usageRes.json());
                }
            } catch (err) {
                console.error("Failed to load account data:", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const handleCancelSubscription = async () => {
        if (!confirm("Are you sure you want to cancel your subscription? You'll keep access until the end of the current billing period.")) return;

        setCancelling(true);
        try {
            const res = await fetch("/api/billing/cancel", { method: "POST" });
            if (res.ok) {
                toast({ title: "Subscription cancelled", description: "You'll keep access until the end of your billing period." });
                // Refresh billing data
                const billingRes = await fetch("/api/billing/status");
                if (billingRes.ok) setBilling(await billingRes.json());
            } else {
                throw new Error("Failed to cancel");
            }
        } catch {
            toast({ title: "Error", description: "Failed to cancel subscription.", variant: "destructive" });
        } finally {
            setCancelling(false);
        }
    };

    const plan = billing?.plan || "free";

    return (
        <div className="min-h-screen bg-neutral-50/50">
            <SiteHeader />

            <main className="py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-8">Account</h1>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-6">

                            {/* Plan & Billing Card */}
                            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    <h2 className="text-lg font-semibold text-neutral-900">Plan & Billing</h2>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-neutral-600">Current plan:</span>
                                            <PlanBadge plan={plan} />
                                        </div>
                                        {plan === "free" ? (
                                            <Button asChild size="sm">
                                                <Link href="/pricing">
                                                    Upgrade
                                                    <ArrowUpRight className="ml-1.5 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleCancelSubscription}
                                                disabled={cancelling}
                                            >
                                                {cancelling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                                Cancel subscription
                                            </Button>
                                        )}
                                    </div>

                                    {billing?.subscription && (
                                        <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
                                            <div className="flex justify-between">
                                                <span>Status</span>
                                                <span className="font-medium capitalize text-neutral-900">
                                                    {billing.subscription.status}
                                                </span>
                                            </div>
                                            {billing.expiresAt && (
                                                <div className="flex justify-between mt-2">
                                                    <span>Next billing date</span>
                                                    <span className="font-medium text-neutral-900">
                                                        {new Date(billing.expiresAt).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Usage Card */}
                            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                    <h2 className="text-lg font-semibold text-neutral-900">Usage This Month</h2>
                                </div>
                                <div className="p-6 space-y-5">
                                    {usage ? (
                                        <>
                                            <UsageBar label="AI Generations" used={usage.generations.used} limit={usage.generations.limit} />
                                            <UsageBar label="Exports" used={usage.exports.used} limit={usage.exports.limit} />
                                            <UsageBar label="AI Rewrites" used={usage.rewrites.used} limit={usage.rewrites.limit} />
                                            <UsageBar label="Image Regenerations" used={usage.imageRegens.used} limit={usage.imageRegens.limit} />
                                        </>
                                    ) : (
                                        <p className="text-sm text-neutral-500">No usage data available.</p>
                                    )}
                                </div>
                            </div>

                            {/* Security Card */}
                            <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
                                    <Shield className="h-5 w-5 text-primary" />
                                    <h2 className="text-lg font-semibold text-neutral-900">Security</h2>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-neutral-900">Sign out</p>
                                            <p className="text-sm text-neutral-500">Sign out of your account on this device.</p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Sign out
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
