"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { Project } from "@/types/project";
import type { Slide } from "@/types/slide";
import {
    Copy,
    ImageIcon,
    Sparkles,
    Trash2,
    Type,
    Wand2
} from "lucide-react";
import { useState } from "react";

interface SlidePropertiesProps {
  slide: Slide | null;
  project: Project;
}

export function SlideProperties({ slide, project }: SlidePropertiesProps) {
  const { toast } = useToast();
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteIntent, setRewriteIntent] = useState<string>("");

  if (!slide) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a slide to edit its properties
      </div>
    );
  }

  const handleRewrite = async (intent: string) => {
    setIsRewriting(true);
    try {
      const res = await fetch(`/api/slides/${slide.id}/rewrite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent }),
      });

      if (!res.ok) {
        throw new Error("Rewrite failed");
      }

      const data = await res.json();
      
      toast({
        title: "Content rewritten",
        description: `Slide has been ${intent}.`,
      });
    } catch (error) {
      console.error("Rewrite error:", error);
      toast({
        title: "Rewrite failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRewriting(false);
    }
  };

  const handleRegenerateImage = async () => {
    try {
      const res = await fetch(`/api/slides/${slide.id}/image/regenerate`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Image regeneration failed");
      }

      toast({
        title: "Image regenerated",
        description: "New image has been applied.",
      });
    } catch (error) {
      console.error("Image regen error:", error);
      toast({
        title: "Failed to regenerate image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Slide Info */}
      <div>
        <h3 className="font-medium mb-2">Slide {slide.order + 1}</h3>
        <Badge variant="secondary" className="capitalize">
          {slide.layout.replace("_", " ")}
        </Badge>
      </div>

      {/* AI Tools */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Tools
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRewrite("shorter")}
            disabled={isRewriting}
          >
            <Wand2 className="w-3 h-3 mr-1" />
            Shorter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRewrite("longer")}
            disabled={isRewriting}
          >
            <Wand2 className="w-3 h-3 mr-1" />
            Longer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRewrite("simpler")}
            disabled={isRewriting}
          >
            <Wand2 className="w-3 h-3 mr-1" />
            Simpler
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRewrite("formal")}
            disabled={isRewriting}
          >
            <Wand2 className="w-3 h-3 mr-1" />
            Formal
          </Button>
        </div>

        <div className="flex gap-2">
          <select
            className="flex-1 px-3 py-2 border rounded text-sm"
            value={rewriteIntent}
            onChange={(e) => setRewriteIntent(e.target.value)}
          >
            <option value="">Custom rewrite...</option>
            <option value="add_examples">Add examples</option>
            <option value="add_statistics">Add statistics</option>
            <option value="make_engaging">Make more engaging</option>
          </select>
          <Button
            size="sm"
            onClick={() => handleRewrite(rewriteIntent)}
            disabled={!rewriteIntent || isRewriting}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Image Tools */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Image
        </h4>

        {slide.imageAssetId ? (
          <div className="space-y-2">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleRegenerateImage}
              >
                Regenerate
              </Button>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full">
            <ImageIcon className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        )}
      </div>

      {/* Speaker Notes */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Type className="w-4 h-4" />
          Speaker Notes
        </h4>
        <Textarea
          placeholder="Add speaker notes..."
          className="min-h-[100px] text-sm"
          defaultValue={slide.speakerNotes || ""}
        />
        <Button size="sm" variant="outline" className="w-full">
          Save Notes
        </Button>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-4 border-t">
        <Button variant="outline" className="w-full">
          <Copy className="w-4 h-4 mr-2" />
          Duplicate Slide
        </Button>
        <Button variant="destructive" className="w-full">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Slide
        </Button>
      </div>
    </div>
  );
}

