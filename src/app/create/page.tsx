"use client";

import { AuthGate } from "@/components/auth/auth-gate";
import { CreateWizard } from "@/components/create/create-wizard";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function CreatePage() {
  return (
    <AuthGate>
      <div className="min-h-screen bg-gray-50 text-neutral-900">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Create New Presentation</h1>
            <p className="mt-2 text-gray-600">
              Follow the steps to generate your AI-powered presentation
            </p>
          </div>
          <CreateWizard />
        </main>
        <SiteFooter />
      </div>
    </AuthGate>
  );
}

