import { create } from "zustand";
import type { Project } from "@/types/project";

type ProjectsState = {
  projects: Project[];
  isLoading: boolean;
  setProjects: (projects: Project[]) => void;
  upsertProject: (project: Project) => void;
  setIsLoading: (value: boolean) => void;
};

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  isLoading: false,
  setProjects: (projects) => set({ projects }),
  setIsLoading: (isLoading) => set({ isLoading }),
  upsertProject: (project) =>
    set((state) => {
      const idx = state.projects.findIndex((p) => p.id === project.id);
      if (idx === -1) return { projects: [project, ...state.projects] };
      const next = state.projects.slice();
      next[idx] = project;
      return { projects: next };
    }),
}));

