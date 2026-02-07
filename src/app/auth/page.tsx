"use client";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";

type AuthMode = "login" | "signup";

function AuthFormContent() {
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as AuthMode) || "login";
  const [mode, setMode] = React.useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  // Focus email input on mount
  React.useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call for demo
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Demo validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    // Success - redirect to dashboard
    setIsLoading(false);
    window.location.href = "/dashboard";
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo / Brand */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-neutral-900">
            SlideRush<span className="text-primary">.ai</span>
          </span>
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-neutral-200/60 bg-white shadow-xl shadow-neutral-200/50 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">
            {mode === "login" ? "Welcome back 👋" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            {mode === "login"
              ? "Enter your credentials to access your decks"
              : "Start creating presentations in seconds"}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 mb-6 rounded-xl bg-neutral-100">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === "login"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === "signup"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Sign up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              ref={emailInputRef}
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="h-11"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === "login" && (
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:text-primary-hover transition-colors"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-11"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : mode === "login" ? (
              <>
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-neutral-500">or continue with</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-1 gap-3">
          {/* Google */}
          <GoogleSignInButton />
        </div>

        {/* Phone Link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-neutral-600 hover:text-primary transition-colors"
          >
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Trust Signals */}
        <div className="mt-6 pt-6 border-t border-neutral-100">
          <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              Secure
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Encrypted
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-neutral-400">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="hover:text-neutral-600 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="hover:text-neutral-600 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-6 text-center text-sm text-neutral-500">
        Need help?{" "}
        <a href="#" className="text-primary hover:text-primary-hover transition-colors font-medium">
          Contact support
        </a>
      </p>
    </div>
  );
}

function AuthFormLoading() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-neutral-200/60 bg-white shadow-xl shadow-neutral-200/50 p-6 sm:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-1/2 mx-auto mb-6" />
          <div className="h-10 bg-neutral-200 rounded" />
          <div className="h-10 bg-neutral-200 rounded" />
          <div className="h-11 bg-neutral-200 rounded" />
          <div className="h-11 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50">
      <SiteHeader />

      <main className="flex items-center justify-center py-12 px-4">
        <Suspense fallback={<AuthFormLoading />}>
          <AuthFormContent />
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  );
}

