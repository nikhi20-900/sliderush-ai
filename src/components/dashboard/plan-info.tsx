"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Sparkles, Zap } from "lucide-react";

interface PlanInfoProps {
  plan: string;
  features: {
    panicMode: boolean;
    watermark: boolean;
    maxSlides: number;
  };
  onUpgrade?: () => void;
}

export function PlanInfo({ plan, features, onUpgrade }: PlanInfoProps) {
  const planColors = {
    free: "bg-gray-100 border-gray-200",
    pro: "bg-blue-50 border-blue-200",
    ultra: "bg-purple-50 border-purple-200",
  };

  const planIcons = {
    free: "Free",
    pro: "Pro",
    ultra: "Ultra",
  };

  const planBadgeColors = {
    free: "bg-gray-500",
    pro: "bg-blue-500",
    ultra: "bg-purple-500",
  };

  const benefits = {
    free: [
      "5 generations/month",
      "3 exports/month",
      "Basic templates",
      "Community support",
    ],
    pro: [
      "50 generations/month",
      "100 exports/month",
      "All premium templates",
      "PDF export",
      "AI rewriting tools",
      "Priority support",
    ],
    ultra: [
      "Unlimited generations",
      "Unlimited exports",
      "Panic mode (20s generation)",
      "Custom branding",
      "Image regeneration",
      "Premium support",
    ],
  };

  return (
    <Card className={planColors[plan as keyof typeof planColors] || planColors.free}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              plan === "ultra" ? "bg-purple-100" : plan === "pro" ? "bg-blue-100" : "bg-gray-100"
            }`}>
              {plan === "ultra" ? (
                <Crown className="h-5 w-5 text-purple-600" />
              ) : plan === "pro" ? (
                <Sparkles className="h-5 w-5 text-blue-600" />
              ) : (
                <Zap className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <p className="text-sm text-gray-500">
                {plan === "free" ? "Starter" : plan === "pro" ? "Professional" : "Ultimate"} Plan
              </p>
            </div>
          </div>
          <Badge className={planBadgeColors[plan as keyof typeof planBadgeColors] || planBadgeColors.free}>
            {planIcons[plan as keyof typeof planIcons] || planIcons.free}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Features List */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Your Benefits:</p>
          <ul className="space-y-1">
            {(benefits[plan as keyof typeof benefits] || benefits.free).map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Feature Flags */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className={`p-2 rounded ${
            features.panicMode ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
          }`}>
            <div className="font-medium">Panic Mode</div>
            <div>{features.panicMode ? "✓ Enabled" : "✗ Disabled"}</div>
          </div>
          <div className={`p-2 rounded ${
            !features.watermark ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
          }`}>
            <div className="font-medium">Watermark</div>
            <div>{features.watermark ? "✓ On" : "✗ Off"}</div>
          </div>
          <div className={`p-2 rounded ${
            features.maxSlides > 12 ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
          }`}>
            <div className="font-medium">Max Slides</div>
            <div>{features.maxSlides}</div>
          </div>
        </div>

        {/* Upgrade Button */}
        {plan !== "ultra" && (
          <Button onClick={onUpgrade} className="w-full" variant={plan === "pro" ? "default" : "secondary"}>
            {plan === "free" ? "Upgrade to Pro" : "Upgrade to Ultra"}
            <Crown className="ml-2 h-4 w-4" />
          </Button>
        )}

        {plan === "ultra" && (
          <div className="text-center text-sm text-purple-600 font-medium">
            ✨ You have access to all features!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

