import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Project } from "@/types/project";

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  const statusLabel = project.status.charAt(0).toUpperCase() + project.status.slice(1);

  return (
    <Link href={`/editor/${project.id}`}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader>
          <CardTitle className="line-clamp-1 text-base">{project.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-xs">
            {project.topic}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-xs text-neutral-600">
          <span>{project.slideCount} slides</span>
          <span>{statusLabel}</span>
        </CardContent>
      </Card>
    </Link>
  );
}

