"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock, Users, Zap } from "lucide-react";
import Link from "next/link";

export function CTAGetStarted() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-primary to-accent" />
      <div className="absolute inset-0 -z-10 bg-[url('/grid-pattern.svg')] opacity-10" />

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

      <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Content */}
        <div className="relative">
          {/* Badge */}
          <div className="mb-6 inline-flex animate-fade-in-up">
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              Join 50,000+ creators
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl animate-fade-in-up stagger-1">
            Ready to create your next deck?
          </h2>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl animate-fade-in-up stagger-2">
            Stop spending hours on slides. Let AI do the heavy lifting while you focus on your message.
          </p>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 animate-fade-in-up stagger-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">12s</div>
                <div className="text-sm text-white/60">Avg. generation</div>
              </div>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm text-white/60">Decks created</div>
              </div>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">10x</div>
                <div className="text-sm text-white/60">Faster workflow</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up stagger-4">
            <Button
              size="xl"
              className="gap-2 bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20"
            >
              <Link href="/create" className="flex items-center gap-2">
                Create free deck
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60 animate-fade-in-up stagger-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Free plan available
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

