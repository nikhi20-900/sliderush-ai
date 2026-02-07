"use client";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock3, Sparkles, Star, Zap } from "lucide-react";
import Link from "next/link";
import * as React from "react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    tagline: "Perfect for trying out",
    description: "Get started with basic features and watermarked exports.",
    gradient: "from-neutral-400 to-neutral-500",
    bgGradient: "from-neutral-50 to-neutral-100",
    features: [
      { text: "5 AI generations per month", included: true },
      { text: "Basic templates", included: true },
      { text: "Watermarked exports", included: true },
      { text: "Manual editing", included: true },
      { text: "Export to PPTX & PDF", included: true },
      { text: "Premium templates", included: false },
      { text: "AI rewrite tools", included: false },
      { text: "Panic Mode", included: false },
      { text: "Image regeneration", included: false },
      { text: "Custom branding", included: false },
    ],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹499",
    tagline: "For regular creators",
    description: "Everything you need for professional presentations.",
    gradient: "from-primary to-primary-dark",
    bgGradient: "from-violet-50 to-purple-50",
    features: [
      { text: "50 AI generations per month", included: true },
      { text: "Premium templates", included: true },
      { text: "No watermark", included: true },
      { text: "AI rewrite tools", included: true },
      { text: "Export to PPTX & PDF", included: true },
      { text: "Manual editing", included: true },
      { text: "Image regeneration (20/month)", included: true },
      { text: "Panic Mode", included: false },
      { text: "Custom branding", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Ultra",
    price: "₹999",
    tagline: "For power users",
    description: "Maximum power with Panic Mode and full customization.",
    gradient: "from-accent to-accent-dark",
    bgGradient: "from-orange-50 to-amber-50",
    features: [
      { text: "Unlimited AI generations", included: true },
      { text: "All premium templates", included: true },
      { text: "No watermark", included: true },
      { text: "AI rewrite tools", included: true },
      { text: "Export to PPTX & PDF", included: true },
      { text: "Panic Mode (~15s)", included: true },
      { text: "Unlimited image regeneration", included: true },
      { text: "Custom branding", included: true },
      { text: "University logos", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Go Ultra",
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "What counts as a generation?",
    answer: "Each time you create a new deck counts as one generation. You can have multiple slides per generation based on your slide count selection.",
  },
  {
    question: "Is there a free trial for Pro/Ultra?",
    answer: "We offer a free tier so you can try before you upgrade. No credit card required to get started.",
  },
  {
    question: "Can I change plans later?",
    answer: "Absolutely! You can upgrade or downgrade at any time. Changes take effect on your next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, UPI, and net banking through Razorpay.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <SiteHeader />

      <main className="py-20">
        {/* Header */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              Simple pricing
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              Choose your{" "}
              <span className="gradient-text">power level</span>
            </h1>
            <p className="mt-4 text-lg text-neutral-600">
              Start free, upgrade when you need more power. No hidden fees.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {plans.map((plan, idx) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border ${
                  plan.popular
                    ? "border-primary/30 shadow-xl shadow-primary/10"
                    : "border-neutral-200 shadow-lg"
                } bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-px left-0 right-0 flex justify-center">
                    <span className="rounded-b-xl bg-gradient-to-r from-primary to-accent px-4 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className={`p-6 ${plan.popular ? "pt-10" : ""}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-neutral-900">
                      {plan.name}
                    </h3>
                    {plan.popular && (
                      <Star className="h-5 w-5 text-primary fill-primary" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">{plan.tagline}</p>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-neutral-900">
                      {plan.price}
                    </span>
                    <span className="text-neutral-500">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">
                    {plan.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.text}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2
                          className={`mt-0.5 h-5 w-5 shrink-0 ${
                            feature.included
                              ? "text-success"
                              : "text-neutral-300"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            feature.included
                              ? "text-neutral-700"
                              : "text-neutral-400"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-6">
                    <Button
                      asChild
                      size="lg"
                      className={`w-full ${
                        plan.popular
                          ? "bg-primary hover:bg-primary-hover"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      <Link href="/auth">{plan.cta}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-20 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
              Why choose SlideRush AI?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-neutral-900">Lightning Fast</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Generate complete decks in 12-20 seconds with our optimized AI pipeline.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                  <Clock3 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-neutral-900">Panic Mode</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Ultra users get instant decks when deadlines are looming. Just type and go.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-neutral-900">AI-Powered</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Two-pass AI ensures quality outlines and content, every single time.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-200 bg-white overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-50"
                  >
                    <span className="font-medium text-neutral-900">
                      {faq.question}
                    </span>
                    <svg
                      className={`h-5 w-5 text-neutral-500 transition-transform ${
                        openFaq === idx ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openFaq === idx && (
                    <div className="border-t border-neutral-100 p-4 text-neutral-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

