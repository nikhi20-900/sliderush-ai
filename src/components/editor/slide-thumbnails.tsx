"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";
import type { Slide } from "@/types/slide";
import { GripVertical, Plus, Trash2 } from "lucide-react";

interface SlideThumbnailsProps {
  slides: Slide[];
  selectedSlideId: string | null;
  onSelectSlide: (id: string) => void;
  project: Project;
}

// Template color schemes
const TEMPLATES: Record<string, { colors: { primary: string; background: string; text: string } }> = {
  "modern-minimal": { colors: { primary: "#2563eb", background: "#ffffff", text: "#1e293b" } },
  "bold-corporate": { colors: { primary: "#1e3a5f", background: "#ffffff", text: "#1e293b" } },
  "creative-gradient": { colors: { primary: "#7c3aed", background: "#ffffff", text: "#1e293b" } },
  "classic-professional": { colors: { primary: "#000000", background: "#ffffff", text: "#000000" } },
  "tech-startup": { colors: { primary: "#00d4aa", background: "#0f172a", text: "#f1f5f9" } },
};

export function SlideThumbnails({
  slides,
  selectedSlideId,
  onSelectSlide,
  project,
}: SlideThumbnailsProps) {
  const template = TEMPLATES[project.templateId] || TEMPLATES["modern-minimal"];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm text-gray-500">Slides</h3>
        <Button variant="ghost" size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            onClick={() => onSelectSlide(slide.id)}
            className={cn(
              "group relative cursor-pointer rounded-lg border-2 transition-all",
              selectedSlideId === slide.id
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            {/* Thumbnail Preview */}
            <div
              className="aspect-video p-2 rounded-t-lg"
              style={{ backgroundColor: template.colors.background }}
            >
              <div className="h-full flex flex-col gap-1">
                {/* Title */}
                <div
                  className="text-[6px] font-bold truncate"
                  style={{ color: template.colors.text, fontFamily: "sans-serif" }}
                >
                  {slide.title}
                </div>
                {/* Bullets Preview */}
                <div className="space-y-0.5 flex-1">
                  {slide.bullets.slice(0, 3).map((bullet, i) => (
                    <div
                      key={i}
                      className="h-1 bg-gray-200 rounded"
                      style={{ width: `${Math.random() * 40 + 40}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Slide Number & Actions */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-b-lg">
              <span className="text-xs text-gray-500">
                {index + 1}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <GripVertical className="w-3 h-3 text-gray-400" />
                </button>
                <button className="p-1 hover:bg-red-100 rounded">
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              </div>
            </div>

            {/* Selected Indicator */}
            {selectedSlideId === slide.id && (
              <div className="absolute -right-1 -top-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">
                  {index + 1}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Slide Button */}
      <button
        className="w-full mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
        onClick={() => {
          // Add new slide logic
        }}
      >
        <Plus className="w-5 h-5 mx-auto" />
        <span className="text-xs mt-1 block">Add Slide</span>
      </button>
    </div>
  );
}

