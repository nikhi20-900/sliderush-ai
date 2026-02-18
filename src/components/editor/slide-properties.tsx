"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { UpgradePrompt } from "@/components/ui/upgrade/upgrade-prompt";
import type { Feature } from "@/lib/features/gating";
import type { Project } from "@/types/project";
import type { Slide } from "@/types/slide";
import {
  Copy,
  Crown,
  ImageIcon,
  Lock,
  Sparkles,
  Trash2,
  Type,
  Wand2,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface SlidePropertiesProps {
  slide: Slide | null;
  project: Project;
  userPlan?: string;
}

export function SlideProperties({ slide, project, userPlan = "free" }: SlidePropertiesProps) {
  const { toast } = useToast();
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteIntent, setRewriteIntent] = useState<string>("");
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<Feature>("ai_rewrite");

  const canRewrite = userPlan === "pro" || userPlan === "ultra";
  const canRegenImage = userPlan === "ultra";

  if (!slide) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a slide to edit its properties
      </div>
    );
  }

  const handleLockedClick = (feature: Feature) => {
    setUpgradeFeature(feature);
    setShowUpgradePrompt(true);
  };

  const handleRewrite = async (intent: string) => {
    if (!canRewrite) {
      handleLockedClick("ai_rewrite");
      return;
    }

    setIsRewriting(true);
    try {
      const res = await fetch(`/api/slides/${slide.id}/rewrite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, projectId: project.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 403 && data.upgradeRequired) {
          handleLockedClick("ai_rewrite");
          return;
        }
        throw new Error(data.error || "Rewrite failed");
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
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRewriting(false);
    }
  };

  const handleRegenerateImage = async () => {
    if (!canRegenImage) {
      handleLockedClick("image_regen");
      return;
    }

    try {
      const query = slide.imageAssetId || slide.title;
      const res = await fetch(
        `/api/projects/${project.id}/slides/${slide.id}/image/regenerate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 403 && data.upgradeRequired) {
          handleLockedClick("image_regen");
          return;
        }
        throw new Error(data.error || "Image regeneration failed");
      }

      toast({
        title: "Image regenerated",
        description: "New image has been applied.",
      });
    } catch (error) {
      console.error("Image regen error:", error);
      toast({
        title: "Failed to regenerate image",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
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
            {!canRewrite && (
              <Badge variant="outline" className="text-xs ml-auto gap-1">
                <Crown className="w-3 h-3" />
                Pro
              </Badge>
            )}
          </h4>

          <div className={`relative ${!canRewrite ? "opacity-60" : ""}`}>
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

            <div className="flex gap-2 mt-2">
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

            {/* Lock overlay for free users */}
            {!canRewrite && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-lg cursor-pointer hover:bg-white/60 transition-colors"
                onClick={() => handleLockedClick("ai_rewrite")}
              >
                <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm text-sm font-medium text-gray-600">
                  <Lock className="h-3.5 w-3.5" />
                  Upgrade to Pro
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Tools */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Image
            {!canRegenImage && (
              <Badge variant="outline" className="text-xs ml-auto gap-1">
                <Zap className="w-3 h-3" />
                Ultra
              </Badge>
            )}
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
                  {!canRegenImage && <Lock className="w-3 h-3 mr-1" />}
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

      {/* Upgrade Prompt Dialog */}
      <UpgradePrompt
        feature={upgradeFeature}
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onUpgrade={() => {
          setShowUpgradePrompt(false);
          window.location.href = "/pricing";
        }}
      />
    </>
  );
}
