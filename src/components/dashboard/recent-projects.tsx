"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Copy,
    Download,
    Edit3,
    FileText,
    Loader2,
    MoreVertical,
    Trash2
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Project {
  id: string;
  title: string;
  topic: string;
  slideCount: number;
  status: "draft" | "generating" | "ready" | "error" | "cancelled";
  updatedAt: Date;
  templateId?: string;
}

interface RecentProjectsProps {
  projects: Project[];
  onDelete?: (projectId: string) => void;
  onDuplicate?: (projectId: string) => void;
}

export function RecentProjects({ projects, onDelete, onDuplicate }: RecentProjectsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statusConfig = {
    draft: { color: "bg-gray-100 text-gray-700", icon: FileText, label: "Draft" },
    generating: { color: "bg-blue-100 text-blue-700", icon: Loader2, label: "Generating" },
    ready: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Ready" },
    error: { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "Error" },
    cancelled: { color: "bg-orange-100 text-orange-700", icon: Clock, label: "Cancelled" },
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No projects yet</p>
            <p className="text-sm">Create your first presentation to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Projects</CardTitle>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projects.map((project) => {
            const status = statusConfig[project.status];
            const StatusIcon = status.icon;
            const isExpanded = expandedId === project.id;

            return (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`p-2 rounded-lg ${status.color}`}>
                    <StatusIcon className={`h-4 w-4 ${project.status === "generating" ? "animate-spin" : ""}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{project.title || project.topic}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{project.slideCount} slides</span>
                      <span>•</span>
                      <span>{formatDate(project.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={status.color}>
                    {status.label}
                  </Badge>
                  
                  <div className="flex items-center gap-1">
                    {project.status === "ready" && (
                      <Link href={`/editor/${project.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    
                    {project.status === "ready" && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setExpandedId(isExpanded ? null : project.id)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Expanded Actions */}
                {isExpanded && (
                  <div className="flex items-center gap-2 pt-2 border-t mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDuplicate?.(project.id)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Duplicate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDelete?.(project.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

