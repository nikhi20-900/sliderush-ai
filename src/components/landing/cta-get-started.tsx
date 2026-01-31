import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTAGetStarted() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-10 shadow-sm sm:px-10">
        <div className="mx-auto max-w-2xl space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
            Ready to create your next deck?
          </h2>
          <p className="text-neutral-600">
            Start with your topic, choose a template, and let SlideRush AI handle
            the outline, slides, and images. Edit anytime, export when you’re ready.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/create" className="inline-flex items-center gap-2">
                Start a deck
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

