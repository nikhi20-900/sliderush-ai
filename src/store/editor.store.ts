import { create } from "zustand";
import type { Project } from "@/types/project";
import type { Slide } from "@/types/slide";

type EditorState = {
  project: Project | null;
  slides: Slide[];
  selectedSlideId: string | null;
  setProject: (project: Project | null) => void;
  setSlides: (slides: Slide[]) => void;
  selectSlide: (slideId: string | null) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  project: null,
  slides: [],
  selectedSlideId: null,
  setProject: (project) => set({ project }),
  setSlides: (slides) => set({ slides }),
  selectSlide: (selectedSlideId) => set({ selectedSlideId }),
}));

