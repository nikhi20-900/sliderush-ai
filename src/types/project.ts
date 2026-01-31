export type Plan = "free" | "pro" | "ultra";

export type ProjectStatus = "draft" | "generating" | "ready" | "error" | "cancelled";

export type Audience = "students" | "teachers" | "professionals";
export type Tone = "academic" | "simple" | "persuasive";

export type SlideLayout =
  | "title"
  | "agenda"
  | "content_image_left"
  | "content_image_right"
  | "two_column"
  | "timeline"
  | "summary"
  | "qa";

export type ProjectTheme = {
  colorScheme: string;
  fontPairing: string;
  branding?: {
    orgName: string;
    logoAssetId: string;
    placement: "top_left" | "top_right" | "bottom_left" | "bottom_right";
  };
};

export type Project = {
  id: string;
  userId: string;
  title: string;
  topic: string;
  subject: string | null;
  audience: Audience | null;
  tone: Tone | null;
  slideCount: number;
  templateId: string;
  theme?: ProjectTheme;
  status: ProjectStatus;
  generationStage: "outline" | "slides" | "images" | "finalize" | "done" | null;
  generationProgress: number | null;
  generationError: string | null;
  createdAt: unknown;
  updatedAt: unknown;
  lastExportedAt: unknown | null;
  deletedAt: unknown | null;
};

