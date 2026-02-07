"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Clock } from "lucide-react";
import { useState } from "react";

interface SlideCountSelectorProps {
  slideCount: number;
  onSlideCountChange: (count: number) => void;
  onSubmit: () => void;
}

export function SlideCountSelector({
  slideCount,
  onSlideCountChange,
  onSubmit,
}: SlideCountSelectorProps) {
  const [audience, setAudience] = useState<"students" | "teachers" | "professionals">("professionals");

  // Estimate presentation duration based on slide count and audience
  const estimateDuration = () => {
    const minutesPerSlide = audience === "students" ? 1 : audience === "teachers" ? 2 : 1.5;
    const totalMinutes = slideCount * minutesPerSlide;
    
    if (totalMinutes < 15) return "~5-10 minutes";
    if (totalMinutes < 30) return "~10-15 minutes";
    if (totalMinutes < 45) return "~15-20 minutes";
    return "~20-30 minutes";
  };

  const getComplexityLabel = () => {
    if (slideCount <= 6) return "Quick Overview";
    if (slideCount <= 8) return "Standard Presentation";
    if (slideCount <= 10) return "Detailed Coverage";
    return "Comprehensive Deep Dive";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>How many slides?</CardTitle>
        <CardDescription>
          Choose between 6-12 slides based on your needs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Slide Count Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Slide Count</Label>
            <span className="text-2xl font-bold text-blue-600">{slideCount} slides</span>
          </div>
          <Slider
            value={[slideCount]}
            onValueChange={([value]) => onSlideCountChange(value)}
            min={6}
            max={12}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>6 (Quick)</span>
            <span>12 (Detailed)</span>
          </div>
        </div>

        {/* Complexity Indicator */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Estimated Duration</span>
          </div>
          <p className="text-blue-700">{estimateDuration()}</p>
          <p className="text-sm text-blue-600 mt-1">{getComplexityLabel()}</p>
        </div>

        {/* Audience Selection (Optional) */}
        <div className="space-y-2">
          <Label>Target Audience (Optional)</Label>
          <p className="text-sm text-gray-500 mb-3">
            Helps tailor content complexity and examples
          </p>
          <div className="grid grid-cols-3 gap-4">
            {(["students", "teachers", "professionals"] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAudience(a)}
                className={`p-3 rounded-lg border text-center capitalize transition-colors ${
                  audience === a
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Slide Preview */}
        <div className="space-y-2">
          <Label>Presentation Structure</Label>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: Math.min(slideCount, 8) }).map((_, i) => (
              <div
                key={i}
                className="aspect-video bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500"
              >
                Slide {i + 1}
              </div>
            ))}
            {slideCount > 8 && (
              <div className="aspect-video bg-gray-50 rounded border flex items-center justify-center text-xs text-gray-400">
                +{slideCount - 8} more
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button onClick={onSubmit} size="lg">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

