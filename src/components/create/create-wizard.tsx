"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GenerationProgress } from "./generation-progress";
import { SlideCountSelector } from "./slidecount-selector";
import { TemplateGrid } from "./template-grid";
import { TopicInput } from "./topic-input";

type WizardStep = "topic" | "slidecount" | "template" | "generating";

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

const TEMPLATES: Template[] = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean and professional with blue accents",
    preview: "/templates/modern-minimal.svg",
    colors: {
      primary: "#2563eb",
      secondary: "#3b82f6",
      background: "#ffffff",
      text: "#1e293b",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    id: "bold-corporate",
    name: "Bold Corporate",
    description: "Professional with dark navy and orange",
    preview: "/templates/bold-corporate.svg",
    colors: {
      primary: "#1e3a5f",
      secondary: "#f97316",
      background: "#ffffff",
      text: "#1e293b",
    },
    fonts: {
      heading: "Roboto",
      body: "Roboto",
    },
  },
  {
    id: "creative-gradient",
    name: "Creative Gradient",
    description: "Modern with purple-pink gradient",
    preview: "/templates/creative-gradient.svg",
    colors: {
      primary: "#7c3aed",
      secondary: "#ec4899",
      background: "#ffffff",
      text: "#1e293b",
    },
    fonts: {
      heading: "Poppins",
      body: "Poppins",
    },
  },
  {
    id: "classic-professional",
    name: "Classic Professional",
    description: "Traditional black, white, and serif fonts",
    preview: "/templates/classic-professional.svg",
    colors: {
      primary: "#000000",
      secondary: "#4b5563",
      background: "#ffffff",
      text: "#000000",
    },
    fonts: {
      heading: "Merriweather",
      body: "Merriweather",
    },
  },
  {
    id: "tech-startup",
    name: "Tech Startup",
    description: "Modern with neon accents",
    preview: "/templates/tech-startup.svg",
    colors: {
      primary: "#00d4aa",
      secondary: "#0ea5e9",
      background: "#0f172a",
      text: "#f1f5f9",
    },
    fonts: {
      heading: "Space Grotesk",
      body: "Inter",
    },
  },
];

export function CreateWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<WizardStep>("topic");
  const [topic, setTopic] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [slideCount, setSlideCount] = useState(8);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern-minimal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [projectId, setProjectId] = useState<string | null>(null);

  const handleTopicSubmit = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setStep("slidecount");
  };

  const handleSlideCountSubmit = () => {
    setStep("template");
  };

  const handleTemplateSubmit = async () => {
    setStep("generating");
    await generatePresentation();
  };

  const generatePresentation = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // Step 1: Create project
      setProgress(5);
      const createRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          slideCount,
          templateId: selectedTemplate,
          title: topic,
        }),
      });

      if (!createRes.ok) {
        throw new Error("Failed to create project");
      }

      const { projectId: newProjectId } = await createRes.json();
      setProjectId(newProjectId);
      setProgress(10);

      // Step 2: Start generation
      setProgress(15);
      const genRes = await fetch(`/api/projects/${newProjectId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "normal" }),
      });

      if (!genRes.ok) {
        throw new Error("Failed to start generation");
      }

      // Step 3: Poll for status
      await pollGenerationStatus(newProjectId);

      toast({
        title: "Presentation created!",
        description: "Your presentation is ready for editing.",
      });

      router.push(`/editor/${newProjectId}`);
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate presentation. Please try again.",
        variant: "destructive",
      });
      setStep("template");
    } finally {
      setIsGenerating(false);
    }
  };

  const pollGenerationStatus = async (id: string) => {
    const maxAttempts = 120; // 2 minutes max
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;

      const statusRes = await fetch(`/api/projects/${id}/generate/status`);
      if (!statusRes.ok) continue;

      const { status, stage, progress: currentProgress } = await statusRes.json();

      // Update progress based on stage
      if (stage === "outline") {
        setProgress(Math.min(10 + currentProgress * 0.2, 30));
      } else if (stage === "slides") {
        setProgress(Math.min(30 + currentProgress * 0.4, 70));
      } else if (stage === "images") {
        setProgress(Math.min(70 + currentProgress * 0.2, 90));
      } else if (stage === "finalize" || stage === "done") {
        setProgress(100);
        return;
      }

      if (status === "error") {
        throw new Error("Generation failed");
      }
    }

    throw new Error("Generation timeout");
  };

  const renderStep = () => {
    switch (step) {
      case "topic":
        return (
          <TopicInput
            topic={topic}
            onTopicChange={setTopic}
            onSubmit={handleTopicSubmit}
            suggestions={suggestions}
            onSuggestionsChange={setSuggestions}
          />
        );
      case "slidecount":
        return (
          <SlideCountSelector
            slideCount={slideCount}
            onSlideCountChange={setSlideCount}
            onSubmit={handleSlideCountSubmit}
          />
        );
      case "template":
        return (
          <TemplateGrid
            templates={TEMPLATES}
            selectedId={selectedTemplate}
            onSelect={setSelectedTemplate}
            onSubmit={handleTemplateSubmit}
          />
        );
      case "generating":
        return (
          <GenerationProgress
            progress={progress}
            topic={topic}
            slideCount={slideCount}
          />
        );
      default:
        return null;
    }
  };

  const steps = [
    { key: "topic", label: "Topic" },
    { key: "slidecount", label: "Slide Count" },
    { key: "template", label: "Template" },
    { key: "generating", label: "Generating" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s.key} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index <= currentStepIndex
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-2 text-sm ${
                  index <= currentStepIndex ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {s.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-4 ${
                    index < currentStepIndex ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {renderStep()}
    </div>
  );
}

