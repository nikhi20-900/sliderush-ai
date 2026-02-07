"use client";

import { AuthGate } from "@/components/auth/auth-gate";
import { ProjectList } from "@/components/dashboard/project-list";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";
import { useProjectsStore } from "@/store/projects.store";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const projects = useProjectsStore((s) => s.projects);
  const setProjects = useProjectsStore((s) => s.setProjects);
  const isLoading = useProjectsStore((s) => s.isLoading);
  const setIsLoading = useProjectsStore((s) => s.setIsLoading);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setIsLoading(true);
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) return;
        const data = await res.json();
        setProjects(data.projects ?? []);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [user, setIsLoading, setProjects]);

  return (
    <AuthGate>
      <div className="min-h-screen bg-white text-neutral-900">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="text-sm text-neutral-600">
                Create a new presentation or continue where you left off.
              </p>
            </div>
            <Button asChild>
              <Link href="/create">Create new presentation</Link>
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent projects</CardTitle>
              <CardDescription>Your latest decks, sorted by last update.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-neutral-600">Loading projects…</p>
              ) : (
                <ProjectList projects={projects} />
              )}
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    </AuthGate>
  );
}

