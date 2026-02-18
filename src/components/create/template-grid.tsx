"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UpgradePrompt } from "@/components/ui/upgrade/upgrade-prompt";
import { isTemplatePremium } from "@/lib/features/gating";
import { Check, Crown, Lock, Palette } from "lucide-react";
import { useState } from "react";

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

interface TemplateGridProps {
  templates: Template[];
  selectedId: string;
  onSelect: (id: string) => void;
  onSubmit: () => void;
  userPlan?: string;
}

export function TemplateGrid({
  templates,
  selectedId,
  onSelect,
  onSubmit,
  userPlan = "free",
}: TemplateGridProps) {
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(null);

  const filteredTemplates = showPremiumOnly
    ? templates.filter((t) => isTemplatePremium(t.id))
    : templates;

  const handleTemplateClick = (templateId: string) => {
    if (isTemplatePremium(templateId) && userPlan === "free") {
      setPendingTemplateId(templateId);
      setShowUpgradePrompt(true);
      return;
    }
    onSelect(templateId);
  };

  const handleUpgrade = () => {
    window.location.href = "/pricing";
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Choose a template</CardTitle>
              <CardDescription>
                Select a design that fits your presentation style.
              </CardDescription>
            </div>
            {userPlan !== "ultra" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPremiumOnly(!showPremiumOnly)}
              >
                <Palette className="w-4 h-4 mr-2" />
                {showPremiumOnly ? "Show All" : "Premium Only"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredTemplates.map((template) => {
              const isPremium = isTemplatePremium(template.id);
              const isLocked = isPremium && userPlan === "free";
              
              return (
                <div
                  key={template.id}
                  onClick={() => handleTemplateClick(template.id)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedId === template.id
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  } ${isLocked ? "opacity-60" : ""}`}
                >
                  {/* Preview */}
                  <div
                    className="aspect-video p-2"
                    style={{
                      backgroundColor: template.colors.background,
                    }}
                  >
                    <div
                      className="w-full h-full rounded border"
                      style={{
                        borderColor: template.colors.primary,
                        background: `linear-gradient(135deg, ${template.colors.primary}20, ${template.colors.secondary}20)`,
                      }}
                    >
                      <div className="flex flex-col items-center justify-center h-full text-center p-1">
                        <div
                          className="text-xs font-bold"
                          style={{ color: template.colors.text }}
                        >
                          {template.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                      <div className="bg-white rounded-full p-2 shadow-lg">
                        <Lock className="w-5 h-5 text-gray-700" />
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-2 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{template.name}</span>
                      {selectedId === template.id && (
                        <Check className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {template.description}
                    </p>
                  </div>

                  {/* Premium Badge */}
                  {isPremium && (
                    <div className="absolute top-1 left-1">
                      <Badge className="bg-purple-500 text-white text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                  )}

                  {/* Selected Badge */}
                  {selectedId === template.id && (
                    <div className="absolute top-1 right-1">
                      <Badge className="bg-blue-500 text-white text-xs">
                        Selected
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Template Details */}
          {selectedId && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <Label>Selected Template</Label>
              <div className="flex items-center gap-4 mt-2">
                {(() => {
                  const template = templates.find((t) => t.id === selectedId);
                  if (!template) return null;
                  const isPremium = isTemplatePremium(template.id);
                  return (
                    <>
                      <div
                        className="w-12 h-8 rounded border"
                        style={{
                          background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
                        }}
                      />
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {template.name}
                          {isPremium && userPlan === "free" && (
                            <Badge variant="secondary" className="text-xs">
                              <Lock className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {template.fonts.heading} • {template.colors.primary} scheme
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Template Features */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Auto-generated images</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Editable layouts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>One-click export</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button onClick={onSubmit} size="lg">
              Generate Presentation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompt */}
      <UpgradePrompt
        feature="premium_templates"
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onUpgrade={handleUpgrade}
      />
    </>
  );
}

