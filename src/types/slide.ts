import type { SlideLayout } from "./project";

export type Slide = {
  id: string;
  projectId: string;
  order: number;
  layout: SlideLayout;
  title: string;
  bullets: string[];
  speakerNotes: string | null;
  imageAssetId: string | null;
  createdAt: unknown;
  updatedAt: unknown;
};

