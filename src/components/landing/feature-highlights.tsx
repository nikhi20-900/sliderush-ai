"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Clock3,
  FileText,
  Image,
  Layers,
  Sparkles,
  Wand2
} from "lucide-react";
import Link from "next/link";

const mainFeatures = [
  {
    icon: Sparkles,
    title: "Two-pass AI Pipeline",
    description:
      "Outline first, then detailed slide content with bullets, speaker notes, and AI-curated image queries validated via Zod schemas.",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50",
  },
  {
    icon: Wand2,
    title: "Editor Built for Speed",
    description:
      "Inline editing, drag-and-drop with dnd-kit, autosave every 3 seconds, and instant recovery on refresh.",
    gradient: "from-orange-500 to-amber-600",
    bgGradient: "from-orange-50 to-amber-50",
  },
  {
    icon: Clock3,
    title: "Panic Mode Ultra",
    description:
      "Ultra plan shortcut for a complete deck in ~15 seconds. Prioritizes speed with optimized layouts and smart placeholders.",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
  },
];

const secondaryFeatures = [
  {
    icon: FileText,
    title: "Export to PPTX/PDF",
    description: "Native PowerPoint export with proper formatting, fonts, and images preserved.",
  },
  {
    icon: Image,
    title: "Unsplash Integration",
    description: "AI-matched images from Unsplash based on your slide content and topics.",
  },
  {
    icon: Layers,
    title: "Premium Templates",
    description: "Choose from College Seminar, Pitch Deck, Research Report, and more.",
  },
];

export function FeatureHighlights() {
  return (
    <section className="relative overflow-hidden bg-neutral-50/50 py-20 sm:py-28">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 animate-fade-in-up">
            <Sparkles className="h-4 w-4" />
            Why SlideRush AI?
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl animate-fade-in-up stagger-1">
            Everything you need to{" "}
            <span className="gradient-text">create presentations</span>{" "}
            faster
          </h2>
          <p className="mt-4 text-lg text-neutral-600 animate-fade-in-up stagger-2">
            From AI-powered generation to professional export, we've thought of everything.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8 mb-16">
          {mainFeatures.map((feature, idx) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
            >
              {/* Gradient Background */}
              <div
                className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${feature.bgGradient} opacity-50 transition-transform duration-500 group-hover:scale-150`}
              />

              {/* Icon */}
              <div
                className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg shadow-opacity-30 transition-transform duration-300 group-hover:scale-110`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="relative mb-3 text-xl font-semibold text-neutral-900">
                {feature.title}
              </h3>
              <p className="relative text-base text-neutral-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Arrow */}
              <div className="absolute bottom-6 right-6 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Features */}
        <div className="rounded-2xl border border-neutral-200/60 bg-white p-8 shadow-sm animate-fade-in-up stagger-4">
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-semibold text-neutral-900">
              And much more...
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {secondaryFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 rounded-xl p-4 transition-colors hover:bg-neutral-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">{feature.title}</h4>
                  <p className="mt-1 text-sm text-neutral-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center animate-fade-in-up stagger-5">
          <Button asChild size="lg">
            <Link href="/create">
              Try it yourself
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-neutral-500">
            No account required to try • Free tier available
          </p>
        </div>
      </div>
    </section>
  );
}

