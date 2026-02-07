"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

const navItems = [
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-neutral-200/50 bg-white/90 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-white/80"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-lg transition-all group-hover:scale-105 group-hover:shadow-xl">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-black">
            SlideRush.ai
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === item.href
                  ? "text-primary bg-primary/5"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              {item.label}
              {pathname === item.href && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/auth"
            className="px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Sign in
          </Link>
          <Button asChild size="sm" className="gap-1.5 bg-black text-white hover:bg-neutral-800">
            <Link href="/create">
              Get started
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 py-4 sm:hidden animate-fade-in-down">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  pathname === item.href
                    ? "text-primary bg-primary/5"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-neutral-200" />
            <Link
              href="/auth"
              className="px-4 py-3 text-base font-medium text-neutral-600 hover:text-neutral-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign in
            </Link>
            <Button asChild className="mt-2 w-full justify-center bg-black text-white hover:bg-neutral-800">
              <Link href="/create" onClick={() => setIsMobileMenuOpen(false)}>
                Get started
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

