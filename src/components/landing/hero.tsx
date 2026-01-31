import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1 space-y-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
            From idea to presentation in seconds
          </span>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
              AI-powered slides, ready to edit and export as PPTX/PDF
            </h1>
            <p className="text-lg text-neutral-600 sm:text-xl">
              SlideRush AI generates outlines, slide content, and images in one flow.
              Edit, reorder, and export with watermarks removed on paid plans.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/create" className="inline-flex items-center gap-2">
                Create a deck
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
          <p className="text-sm text-neutral-500">
            Auto-saves every few seconds. Panic Mode available on Ultra.
          </p>
        </div>
        <div className="flex-1">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between text-sm text-neutral-600">
              <span>Generation progress</span>
              <span>72%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full w-[72%] bg-neutral-900 transition-all" />
            </div>
            <ul className="mt-6 space-y-3 text-sm text-neutral-700">
              <li>✓ Outline created</li>
              <li>✓ Slides drafted</li>
              <li className="font-semibold text-neutral-900">• Finding images…</li>
              <li className="text-neutral-400">• Finalizing deck…</li>
            </ul>
            <div className="mt-6 rounded-lg border border-dashed border-neutral-200 p-4 text-sm text-neutral-600">
              “Generate a 10-slide pitch deck on sustainable packaging for a
              startup accelerator.” — 18s ETA
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

