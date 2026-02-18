"use client";

import { useState } from "react";
import type { Project } from "@/types/project";
import type { Slide } from "@/types/slide";
import { SlideThumbnails } from "./slide-thumbnails";
import { SlideCanvas } from "./slide-canvas";
import { SlideProperties } from "./slide-properties";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Undo, Redo, Save, Check, AlertCircle, Cloud } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAutosave } from "./use-autosave";
import { useEditorStore, SaveStatus } from "@/store/editor.store";

function SaveIndicator({ status }: { status: SaveStatus }) {
  switch (status) {
    case "saving":
      return (
        <span className="flex items-center gap-1.5 text-xs text-gray-400 animate-pulse">
          <Cloud className="w-3.5 h-3.5" />
          Saving…
        </span>
      );
    case "saved":
      return (
        <span className="flex items-center gap-1.5 text-xs text-green-500">
          <Check className="w-3.5 h-3.5" />
          Saved
        </span>
      );
    case "error":
      return (
        <span className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5" />
          Save failed
        </span>
      );
    default:
      return null;
  }
}

interface EditorShellProps {
  project: Project;
  slides: Slide[];
  selectedSlideId: string | null;
  onSelectSlide: (id: string) => void;
}

export function EditorShell({
  project,
  slides,
  selectedSlideId,
  onSelectSlide,
}: EditorShellProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const saveStatus = useEditorStore((s) => s.saveStatus);
  const { forceSave } = useAutosave();

  const selectedSlide = slides.find((s) => s.id === selectedSlideId) || null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "pptx" }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Export failed");
      }

      const { downloadUrl } = await res.json();

      // Trigger download
      window.open(downloadUrl, "_blank");

      toast({
        title: "Export successful!",
        description: "Your presentation has been downloaded.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    forceSave();
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between bg-white border-b px-4 py-2">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold truncate max-w-[200px]">
            {project.title}
          </h1>
          <span className="text-sm text-gray-500">
            {slides.length} slides
          </span>
          <SaveIndicator status={saveStatus} />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">Save</span>
          </Button>

          <Button variant="outline" size="sm">
            <Undo className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm">
            <Redo className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            onClick={handleExport}
            disabled={isExporting || slides.length === 0}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="ml-2">Export PPTX</span>
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Slide Thumbnails */}
        <div className="w-48 border-r bg-white overflow-y-auto">
          <SlideThumbnails
            slides={slides}
            selectedSlideId={selectedSlideId}
            onSelectSlide={onSelectSlide}
            project={project}
          />
        </div>

        {/* Center - Slide Canvas */}
        <div className="flex-1 overflow-auto p-8">
          <SlideCanvas
            slide={selectedSlide}
            templateId={project.templateId}
            theme={project.theme}
          />
        </div>

        {/* Right Sidebar - Properties & Tools */}
        <div className="w-80 border-l bg-white overflow-y-auto">
          <SlideProperties
            slide={selectedSlide}
            project={project}
          />
        </div>
      </div>
    </div>
  );
}
