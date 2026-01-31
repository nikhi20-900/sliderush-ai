import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailAuthForm } from "@/components/auth/email-auth-form";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { PhoneOtpForm } from "@/components/auth/phone-otp-form";
import { Separator } from "@/components/ui/separator";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
            <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Sign in to access your dashboard, create decks, and export.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EmailAuthForm />
              <div className="flex items-center gap-3 py-1">
                <Separator className="h-px flex-1" />
                <span className="text-xs text-neutral-500">or</span>
                <Separator className="h-px flex-1" />
              </div>
              <GoogleSignInButton />
              <div className="flex items-center gap-3 py-1">
                <Separator className="h-px flex-1" />
                <span className="text-xs text-neutral-500">or</span>
                <Separator className="h-px flex-1" />
              </div>
              <PhoneOtpForm />
              <div className="text-center text-xs text-neutral-500">
                By continuing you agree to our terms (to be added).
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

