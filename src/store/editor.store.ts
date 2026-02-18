import { create } from "zustand";
import type { Project } from "@/types/project";
import type { Slide } from "@/types/slide";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

type EditorState = {
  // State
  project: Project | null;
  slides: Slide[];
  selectedSlideId: string | null;
  saveStatus: SaveStatus;
  isDirty: boolean;
  lastSavedAt: Date | null;

  // Basic setters
  setProject: (project: Project | null) => void;
  setSlides: (slides: Slide[]) => void;
  selectSlide: (slideId: string | null) => void;

  // Slide mutation actions (mark dirty for autosave)
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  addSlide: (slide: Slide) => void;
  deleteSlide: (slideId: string) => void;
  reorderSlides: (orderedIds: string[]) => void;

  // Save status management
  setSaveStatus: (status: SaveStatus) => void;
  markDirty: () => void;
  markSaved: () => void;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  project: null,
  slides: [],
  selectedSlideId: null,
  saveStatus: "idle" as SaveStatus,
  isDirty: false,
  lastSavedAt: null,

  setProject: (project) => set({ project }),
  setSlides: (slides) => set({ slides }),
  selectSlide: (selectedSlideId) => set({ selectedSlideId }),

  updateSlide: (slideId, updates) =>
    set((state) => ({
      slides: state.slides.map((s) =>
        s.id === slideId ? { ...s, ...updates } : s
      ),
      isDirty: true,
    })),

  addSlide: (slide) =>
    set((state) => ({
      slides: [...state.slides, slide],
      isDirty: true,
    })),

  deleteSlide: (slideId) =>
    set((state) => ({
      slides: state.slides.filter((s) => s.id !== slideId),
      selectedSlideId:
        state.selectedSlideId === slideId
          ? state.slides[0]?.id || null
          : state.selectedSlideId,
      isDirty: true,
    })),

  reorderSlides: (orderedIds) =>
    set((state) => {
      const slideMap = new Map(state.slides.map((s) => [s.id, s]));
      const reordered = orderedIds
        .map((id, index) => {
          const slide = slideMap.get(id);
          return slide ? { ...slide, order: index } : null;
        })
        .filter(Boolean) as Slide[];
      return { slides: reordered, isDirty: true };
    }),

  setSaveStatus: (saveStatus) => set({ saveStatus }),

  markDirty: () => set({ isDirty: true }),

  markSaved: () =>
    set({ isDirty: false, saveStatus: "saved", lastSavedAt: new Date() }),
}));
