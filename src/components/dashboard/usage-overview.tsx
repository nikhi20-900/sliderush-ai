"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, Image, Sparkles, Zap } from "lucide-react";

interface UsageCardProps {
  title: string;
  used: number;
  limit: number;
  icon: React.ReactNode;
  percentage?: number;
  color?: "blue" | "green" | "purple" | "orange";
}

function UsageCard({ title, used, limit, icon, percentage = 0, color = "blue" }: UsageCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
  };

  const iconColorClasses = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    orange: "text-orange-600 bg-orange-100",
  };

  return (
    <Card className={colorClasses[color]}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${iconColorClasses[color]}`}>
            {icon}
          </div>
          <Badge variant={percentage >= 90 ? "destructive" : "secondary"} className="text-xs">
            {used} / {limit === 999999 ? "∞" : limit}
          </Badge>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">{title}</p>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-gray-500">{percentage}% used this month</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface UsageOverviewProps {
  usage: {
    generations: { used: number; limit: number; percentage: number };
    exports: { used: number; limit: number; percentage: number };
    rewrites: { used: number; limit: number; percentage: number };
    imageRegens: { used: number; limit: number; percentage: number };
  };
}

export function UsageOverview({ usage }: UsageOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <UsageCard
        title="Generations"
        used={usage.generations.used}
        limit={usage.generations.limit}
        icon={<Zap className="h-4 w-4" />}
        percentage={usage.generations.percentage}
        color="blue"
      />
      <UsageCard
        title="Exports"
        used={usage.exports.used}
        limit={usage.exports.limit}
        icon={<Download className="h-4 w-4" />}
        percentage={usage.exports.percentage}
        color="green"
      />
      <UsageCard
        title="AI Rewrites"
        used={usage.rewrites.used}
        limit={usage.rewrites.limit}
        icon={<Sparkles className="h-4 w-4" />}
        percentage={usage.rewrites.percentage}
        color="purple"
      />
      <UsageCard
        title="Image Regens"
        used={usage.imageRegens.used}
        limit={usage.imageRegens.limit}
        icon={<Image className="h-4 w-4" />}
        percentage={usage.imageRegens.percentage}
        color="orange"
      />
    </div>
  );
}

