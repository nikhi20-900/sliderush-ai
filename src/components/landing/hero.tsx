"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export function Hero() {
  const [progress, setProgress] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(true);

  React.useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          setIsAnimating(false);
          return 85;
        }
        return prev + 2;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            {/* Badge */}
            <div className="inline-flex animate-fade-in-up">
              <span className="group inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                New: Panic Mode for Ultra users
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl animate-fade-in-up stagger-1">
              From{" "}
              <span className="gradient-text">idea</span> to{" "}
              <span className="gradient-text">presentation</span>{" "}
              in seconds
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-neutral-600 sm:text-xl max-w-xl animate-fade-in-up stagger-2">
              AI-powered slides with outlines, content, and images generated automatically. 
              Edit, reorder, and export to PPTX/PDF in minutes, not hours.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center animate-fade-in-up stagger-3">
              <Button asChild size="xl" className="gap-2">
                <Link href="/create">
                  Create your deck
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="gap-2">
                <Link href="/templates">
                  Browse templates
                </Link>
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center gap-6 pt-4 animate-fade-in-up stagger-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white"
                    >
                      {i + 5}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-neutral-600">
                  <strong>50K+</strong> decks created
                </span>
              </div>
              <div className="h-6 w-px bg-neutral-200" />
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-neutral-600">
                  <strong>4.9</strong> rating
                </span>
              </div>
            </div>

            {/* Features Quick List */}
            <div className="grid grid-cols-2 gap-3 pt-2 animate-fade-in-up stagger-5">
              {[
                { icon: Zap, text: "Auto-saves every 3s" },
                { icon: Clock, text: "Panic Mode in 15s" },
                { icon: CheckCircle2, text: "Edit & customize" },
                { icon: Sparkles, text: "AI images included" },
              ].map((feature) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-2 text-sm text-neutral-600"
                >
                  <feature.icon className="h-4 w-4 text-primary" />
                  {feature.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Demo Card */}
          <div className="flex-1 animate-scale-in">
            <div className="relative">
              {/* Card */}
              <div className="relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-white/80 backdrop-blur-xl shadow-2xl shadow-primary/10 p-6">
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">
                        Generating your deck
                      </div>
                      <div className="text-xs text-neutral-500">
                        AI is working hard...
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{progress}%</div>
                    <div className="text-xs text-neutral-500 animate-pulse">Processing</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6 h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  {[
                    { step: "Creating outline", status: "complete" },
                    { step: "Writing slide content", status: "complete" },
                    { step: "Finding perfect images", status: "current" },
                    { step: "Finalizing deck", status: "pending" },
                  ].map((item, idx) => (
                    <div
                      key={item.step}
                      className={`flex items-center gap-3 rounded-lg p-3 transition-all ${
                        item.status === "current"
                          ? "bg-primary/5 border border-primary/10"
                          : "bg-neutral-50"
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          item.status === "complete"
                            ? "bg-success text-white"
                            : item.status === "current"
                            ? "bg-primary text-white"
                            : "bg-neutral-200 text-neutral-400"
                        }`}
                      >
                        {item.status === "complete" ? (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : item.status === "current" ? (
                          <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        ) : (
                          <span className="text-xs">{idx + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          item.status === "complete"
                            ? "text-neutral-500"
                            : item.status === "current"
                            ? "font-medium text-neutral-900"
                            : "text-neutral-400"
                        }`}
                      >
                        {item.step}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Prompt Example */}
                <div className="mt-6 rounded-xl border border-dashed border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Zap className="h-3 w-3" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-neutral-500 mb-1">Your prompt</div>
                      <p className="text-sm text-neutral-700 italic">
                        "Generate a 10-slide pitch deck on sustainable packaging for a startup accelerator."
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                          <Clock className="h-3 w-3" />
                          ~12s remaining
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

