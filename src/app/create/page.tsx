import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthGate } from "@/components/auth/auth-gate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreatePage() {
  return (
    <AuthGate>
      <div className="min-h-screen bg-white text-neutral-900">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl">
            <Card>
              <CardHeader>
                <CardTitle>Create</CardTitle>
                <CardDescription>
                  Wizard UI comes next (topic → slide count → template → generate).
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-neutral-600">
                You’re signed in. Next: build the create wizard.
              </CardContent>
            </Card>
          </div>
        </main>
        <SiteFooter />
      </div>
    </AuthGate>
  );
}

