"use client";

import * as React from "react";
import { Search, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import Link from "next/link";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  slides: number;
  popular: boolean;
  gradient: string;
}

const templates: Template[] = [
  {
    id: "college_seminar",
    name: "College Seminar",
    description: "Clean structure for classroom talks and academic presentations.",
    category: "Education",
    slides: 10,
    popular: true,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "research_report",
    name: "Research Report",
    description: "Methodology, findings, and discussion-ready layout for researchers.",
    category: "Academic",
    slides: 12,
    popular: false,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "startup_pitch",
    name: "Startup Pitch",
    description: "Problem, solution, traction, and ask. Perfect for investors.",
    category: "Business",
    slides: 10,
    popular: true,
    gradient: "from-orange-500 to-amber-600",
  },
  {
    id: "minimal_clean",
    name: "Minimal Clean",
    description: "Simple, modern, high-contrast design for any topic.",
    category: "General",
    slides: 8,
    popular: false,
    gradient: "from-neutral-500 to-neutral-700",
  },
  {
    id: "creative_visual",
    name: "Creative Visual",
    description: "Image-forward layouts and bold typography for impact.",
    category: "Creative",
    slides: 10,
    popular: false,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "business_proposal",
    name: "Business Proposal",
    description: "Professional layout for client presentations and pitches.",
    category: "Business",
    slides: 12,
    popular: false,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "product_launch",
    name: "Product Launch",
    description: "Feature highlights, benefits, and call-to-action slides.",
    category: "Marketing",
    slides: 8,
    popular: false,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "team_intro",
    name: "Team Introduction",
    description: "Showcase your team with photo-centric slide layouts.",
    category: "Team",
    slides: 6,
    popular: false,
    gradient: "from-amber-500 to-orange-600",
  },
];

const categories = ["All", "Education", "Academic", "Business", "General", "Creative", "Marketing", "Team"];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <SiteHeader />

      <main className="py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Download className="h-4 w-4" />
              Template Gallery
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              Start with a <span className="gradient-text">professional template</span>
            </h1>
            <p className="mt-4 text-lg text-neutral-600">
              Pick a starting point. Change templates anytime in the editor.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 mb-12 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`h-48 bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <span className="text-xs font-medium opacity-80 mb-2">{template.category}</span>
                    <h3 className="text-xl font-bold">{template.name}</h3>
                    <span className="mt-2 text-sm opacity-80">{template.slides} slides</span>
                  </div>
                  {template.popular && (
                    <div className="absolute top-3 right-3">
                      <span className="rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white">
                        Popular
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-neutral-900">{template.name}</h3>
                  <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{template.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">{template.slides} slides • {template.category}</span>
                    <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                      Use template
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-8 text-center text-white shadow-xl shadow-primary/20">
            <h2 className="text-2xl font-bold">Can not find what you are looking for?</h2>
            <p className="mt-2 text-white/80">Our AI can generate custom slides from your topic, no template required.</p>
            <Button asChild size="lg" className="mt-6 bg-white text-primary hover:bg-white/90">
              <Link href="/create">Create custom deck</Link>
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
