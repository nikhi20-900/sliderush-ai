"use client";

import { AuthGate } from "@/components/auth/auth-gate";
import { PlanInfo } from "@/components/dashboard/plan-info";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { UsageOverview } from "@/components/dashboard/usage-overview";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";
import { useProjectsStore } from "@/store/projects.store";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  title: string;
  topic: string;
  slideCount: number;
  status: "draft" | "generating" | "ready" | "error" | "cancelled";
  updatedAt: Date;
  templateId?: string;
}

interface DashboardData {
  usage: {
    generations: { used: number; limit: number; percentage: number };
    exports: { used: number; limit: number; percentage: number };
    rewrites: { used: number; limit: number; percentage: number };
    imageRegens: { used: number; limit: number; percentage: number };
  };
  features: {
    panicMode: boolean;
    watermark: boolean;
    maxSlides: number;
  };
  plan: string;
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const projects = useProjectsStore((s) => s.projects);
  const setProjects = useProjectsStore((s) => s.setProjects);
  const isLoading = useProjectsStore((s) => s.isLoading);
  const setIsLoading = useProjectsStore((s) => s.setIsLoading);
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setIsLoading(true);
      setIsLoadingData(true);
      
      try {
        // Load projects
        const projectsRes = await fetch("/api/projects");
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData.projects ?? []);
        }
        
        // Load usage data
        const usageRes = await fetch("/api/usage");
        if (usageRes.ok) {
          const usageData = await usageRes.json();
          setDashboardData(usageData);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingData(false);
      }
    }
    
    if (user) {
      load();
    }
  }, [user, setIsLoading, setProjects]);

  const handleCreateNew = () => {
    window.location.href = "/create";
  };

  const handleUseTemplate = () => {
    window.location.href = "/templates";
  };

  const handleViewTemplates = () => {
    window.location.href = "/templates";
  };

  const handleViewHistory = () => {
    // Already on dashboard, scroll to projects
    document.getElementById("recent-projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpgrade = () => {
    window.location.href = "/pricing";
  };

  // Mock recent projects (in real app, this would come from the store)
  const mockProjects: Project[] = [
    {
      id: "1",
      title: "Q4 Sales Presentation",
      topic: "Q4 Sales Results",
      slideCount: 10,
      status: "ready",
      updatedAt: new Date(Date.now() - 3600000),
      templateId: "corporate",
    },
    {
      id: "2",
      title: "Product Launch Deck",
      topic: "New Product Introduction",
      slideCount: 8,
      status: "generating",
      updatedAt: new Date(Date.now() - 7200000),
      templateId: "modern",
    },
  ];

  return (
    <AuthGate>
      <div className="min-h-screen bg-white text-neutral-900">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">
              Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}! 👋
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Create a new presentation or continue where you left off.
            </p>
          </div>

          {/* Usage Overview */}
          {dashboardData && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Your Usage This Month</h2>
              <UsageOverview usage={dashboardData.usage} />
            </section>
          )}

          {/* Plan Info & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              {dashboardData && (
                <PlanInfo 
                  plan={dashboardData.plan} 
                  features={dashboardData.features}
                  onUpgrade={handleUpgrade}
                />
              )}
            </div>
            <div className="lg:col-span-1">
              <QuickActions 
                onCreateNew={handleCreateNew}
                onUseTemplate={handleUseTemplate}
                onViewTemplates={handleViewTemplates}
                onViewHistory={handleViewHistory}
              />
            </div>
          </div>

          {/* Recent Projects */}
          <section id="recent-projects">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent projects</CardTitle>
                    <CardDescription>Your latest decks, sorted by last update.</CardDescription>
                  </div>
                  <Button asChild variant="outline">
                    <Link href="/create">Create New</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading || isLoadingData ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p>Loading your projects...</p>
                  </div>
                ) : (
                  <RecentProjects projects={mockProjects} />
                )}
              </CardContent>
            </Card>
          </section>
        </main>
        <SiteFooter />
      </div>
    </AuthGate>
  );
}

