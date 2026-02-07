import { Github, Linkedin, Twitter, Zap } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      {/* Main Footer */}
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-neutral-900">
                SlideRush<span className="text-primary">.ai</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-neutral-600">
              From idea to presentation in seconds. AI-powered slides for everyone.
            </p>
            {/* Social Links */}
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Product</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/templates" className="text-sm text-neutral-600 transition-colors hover:text-primary">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-neutral-600 transition-colors hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-sm text-neutral-600 transition-colors hover:text-primary">
                  Create Deck
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-neutral-600 transition-colors hover:text-primary">
                  What's New
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Resources</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="#" className="text-sm text-neutral-600 transition-colors hover:text-primary">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-neutral-600 transition-colors hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-neutral-600 transition-colors hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-neutral-600 transition-colors hover:text-primary">
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="#" className="text-sm text-neutral-600 transition-colors hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-neutral-600 transition-colors hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-sm text-neutral-600 transition-colors hover:text-primary">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-neutral-600 transition-colors hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 sm:flex-row">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} SlideRush AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-neutral-500">
            <Link href="#" className="transition-colors hover:text-neutral-900">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-neutral-900">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-neutral-900">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

