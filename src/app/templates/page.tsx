import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const templates = [
  { id: "college_seminar", name: "College Seminar", description: "Clean structure for classroom talks." },
  { id: "research_report", name: "Research Report", description: "Method, findings, and discussion-ready." },
  { id: "startup_pitch", name: "Startup Pitch", description: "Problem, solution, traction, ask." },
  { id: "minimal_clean", name: "Minimal Clean", description: "Simple, modern, high-contrast." },
  { id: "creative_visual", name: "Creative Visual", description: "Image-forward layouts and bold titles." },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Templates</h1>
          <p className="mt-3 text-neutral-600">
            Pick a starting point. You can change templates later in the editor.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle>{t.name}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-dashed border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-600">
                  Preview coming soon
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

