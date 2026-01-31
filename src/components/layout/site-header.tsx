import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white text-sm font-bold">
            SR
          </span>
          <span className="text-base">SlideRush AI</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-neutral-700 sm:flex">
          <Link href="/pricing" className="hover:text-neutral-900">
            Pricing
          </Link>
          <Link href="/templates" className="hover:text-neutral-900">
            Templates
          </Link>
          <Link href="/auth" className="hover:text-neutral-900">
            Sign in
          </Link>
          <Button asChild size="sm">
            <Link href="/create">Get started</Link>
          </Button>
        </nav>
        <div className="flex items-center gap-3 sm:hidden">
          <Button asChild size="sm" variant="secondary">
            <Link href="/auth">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/create">Start</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

