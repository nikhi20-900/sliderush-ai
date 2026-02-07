"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, FileText, ImageIcon, Loader2, Sparkles } from "lucide-react";
import { useMemo } from "react";

interface GenerationProgressProps {
  progress: number;
  topic: string;
  slideCount: number;
}

type Stage = "initializing" | "outline" | "slides" | "images" | "finalize" | "complete";

const STAGES: { key: Stage; label: string; icon: typeof FileText }[] = [
  { key: "outline", label: "Creating outline", icon: FileText },
  { key: "slides", label: "Writing slide content", icon: FileText },
  { key: "images", label: "Finding images", icon: ImageIcon },
  { key: "finalize", label: "Finalizing deck", icon: Sparkles },
];

export function GenerationProgress({
  progress,
  topic,
  slideCount,
}: GenerationProgressProps) {
  const currentStage: Stage = useMemo(() => {
    if (progress < 10) return "initializing";
    if (progress < 30) return "outline";
    if (progress < 70) return "slides";
    if (progress < 90) return "images";
    if (progress < 100) return "finalize";
    return "complete";
  }, [progress]);

  const completedStages: Stage[] = useMemo(() => {
    const completed: Stage[] = [];
    if (progress >= 30) completed.push("outline");
    if (progress >= 70) completed.push("slides");
    if (progress >= 90) completed.push("images");
    return completed;
  }, [progress]);

  const stageProgress = useMemo(() => {
    switch (currentStage) {
      case "outline":
        return Math.min((progress - 10) / 20 * 100, 100);
      case "slides":
        return Math.min((progress - 30) / 40 * 100, 100);
      case "images":
        return Math.min((progress - 70) / 20 * 100, 100);
      case "finalize":
        return Math.min((progress - 90) / 10 * 100, 100);
      default:
        return 0;
    }
  }, [currentStage, progress]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generating your presentation</CardTitle>
        <CardDescription>
          Creating a {slideCount}-slide presentation on &ldquo;{topic}&rdquo;
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Overall Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stage Timeline */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          
          <div className="space-y-6">
            {STAGES.map((stage) => {
              const isCompleted = completedStages.includes(stage.key);
              const isCurrent = currentStage === stage.key;
              const Icon = stage.icon;

              return (
                <div key={stage.key} className="relative flex items-start pl-10">
                  {/* Stage Icon */}
                  <div
                    className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Icon className="w-3 h-3" />
                    )}
                  </div>

                  {/* Stage Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {stage.label}
                      </span>
                      {isCurrent && (
                        <span className="text-sm text-blue-600">
                          {Math.round(stageProgress)}%
                        </span>
                      )}
                    </div>
                    
                    {/* Current Stage Progress Bar */}
                    {isCurrent && (
                      <Progress
                        value={stageProgress}
                        className="h-1 mt-2"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            While you wait...
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Your presentation will be fully editable after generation</li>
            <li>• You can reorder slides, rewrite content, and change images</li>
            <li>• Save time by preparing your talking points</li>
          </ul>
        </div>

        {/* Cancel Option */}
        <div className="text-center">
          <button
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={() => {
              // Cancel generation
              window.location.href = "/dashboard";
            }}
          >
            Cancel and go back
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

