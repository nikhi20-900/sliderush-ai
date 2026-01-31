import type { Project } from "@/types/project";
import { ProjectCard } from "@/components/dashboard/project-card";

type Props = {
  projects: Project[];
};

export function ProjectList({ projects }: Props) {
  if (!projects.length) {
    return (
      <p className="text-sm text-neutral-600">
        No projects yet. Click &ldquo;Create new presentation&rdquo; to get started.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}

