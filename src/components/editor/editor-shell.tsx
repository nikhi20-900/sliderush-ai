"use client";

import { useState } from "react";
import type { Project } from "@/types/project";
import type { Slide } from "@/types/slide";
import { SlideThumbnails } from "./slide-thumbnails";
import { SlideCanvas } from "./slide-canvas";
import { SlideProperties } from "./slide-properties";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Undo, Redo, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Autosave is handled automatically, this is for manual save
      toast({
        title: "Saved",
        description: "Your presentation is saved.",
      });
    } finally {
      setIsSaving(false);
    }
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
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
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

