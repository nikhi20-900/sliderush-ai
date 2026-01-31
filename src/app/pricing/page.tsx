import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "₹0",
    tagline: "Try it out",
    bullets: ["Basic templates", "Watermarked exports", "Limited generations/month"],
  },
  {
    name: "Pro",
    price: "₹—",
    tagline: "For regular users",
    bullets: ["No watermark", "Premium templates", "AI rewrite tools"],
  },
  {
    name: "Ultra",
    price: "₹—",
    tagline: "For deadlines",
    bullets: ["Panic Mode", "Image regeneration", "Branding options"],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Pricing</h1>
          <p className="mt-3 text-neutral-600">
            Start free, upgrade when you need watermark-free exports, rewrites, and Panic Mode.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name}>
              <CardHeader>
                <CardTitle>{p.name}</CardTitle>
                <CardDescription>{p.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-semibold">{p.price}</div>
                <ul className="space-y-2 text-sm text-neutral-700">
                  {p.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
                <Button asChild className="w-full">
                  <Link href="/auth">{p.name === "Free" ? "Get started" : "Upgrade"}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

