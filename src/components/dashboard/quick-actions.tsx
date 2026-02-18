"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BookOpen,
    Clock,
    FilePlus2,
    Plus
} from "lucide-react";

interface QuickActionsProps {
  onCreateNew: () => void;
  onUseTemplate: () => void;
  onViewTemplates: () => void;
  onViewHistory: () => void;
}

export function QuickActions({ 
  onCreateNew, 
  onUseTemplate, 
  onViewTemplates, 
  onViewHistory 
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={onCreateNew}
            className="h-auto py-4 flex-col gap-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create New</span>
          </Button>
          
          <Button 
            onClick={onUseTemplate}
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
          >
            <FilePlus2 className="h-5 w-5" />
            <span>From Template</span>
          </Button>
          
          <Button 
            onClick={onViewTemplates}
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
          >
            <BookOpen className="h-5 w-5" />
            <span>Browse Templates</span>
          </Button>
          
          <Button 
            onClick={onViewHistory}
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
          >
            <Clock className="h-5 w-5" />
            <span>Recent History</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

