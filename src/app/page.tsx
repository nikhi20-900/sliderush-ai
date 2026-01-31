import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/landing/hero";
import { FeatureHighlights } from "@/components/landing/feature-highlights";
import { CTAGetStarted } from "@/components/landing/cta-get-started";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <SiteHeader />
      <main>
        <Hero />
        <FeatureHighlights />
        <CTAGetStarted />
      </main>
      <SiteFooter />
    </div>
  );
}
