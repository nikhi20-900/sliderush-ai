import pptxgen from "pptxgenjs";

// Define template themes
const TEMPLATES: Record<string, { colors: { primary: string; secondary: string; background: string; text: string }; fonts: { heading: string; body: string } }> = {
  modern: {
    colors: {
      primary: "2563EB",
      secondary: "3B82F6",
      background: "FFFFFF",
      text: "1F2937",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  corporate: {
    colors: {
      primary: "1E3A5F",
      secondary: "F97316",
      background: "FFFFFF",
      text: "1F2937",
    },
    fonts: {
      heading: "Arial",
      body: "Arial",
    },
  },
  creative: {
    colors: {
      primary: "9333EA",
      secondary: "EC4899",
      background: "FAFAFA",
      text: "1F2937",
    },
    fonts: {
      heading: "Poppins",
      body: "Poppins",
    },
  },
  minimal: {
    colors: {
      primary: "374151",
      secondary: "6B7280",
      background: "FFFFFF",
      text: "1F2937",
    },
    fonts: {
      heading: "Helvetica",
      body: "Helvetica",
    },
  },
};

export interface SlideData {
  id: string;
  order: number;
  layout: string;
  title: string;
  bullets: string[];
  speakerNotes?: string;
  imageAssetId?: string;
  imageUrl?: string; // Direct URL (e.g. from Unsplash)
}

export interface ProjectData {
  id: string;
  title: string;
  topic: string;
  templateId: string;
}

export interface BuildDeckOptions {
  project: ProjectData;
  slides: SlideData[];
  isFreeTier: boolean;
  userName?: string;
  orgName?: string;
}

// Fetch a remote image and return as base64 data URI for PptxGenJS
async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) return null;

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (err) {
    console.error("Failed to fetch image:", url, err);
    return null;
  }
}

// Pre-fetch all slide images in parallel
async function prefetchImages(slides: SlideData[]): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  const fetchPromises: Promise<void>[] = [];

  for (const slide of slides) {
    const url = slide.imageUrl || slide.imageAssetId;
    if (url && !imageMap.has(url)) {
      fetchPromises.push(
        fetchImageAsBase64(url).then((data) => {
          if (data) imageMap.set(url, data);
        })
      );
    }
  }

  await Promise.all(fetchPromises);
  return imageMap;
}

// Helper function to format bullets as text array
function formatBullets(bullets: string[]): pptxgen.TextProps[] {
  return bullets.map((bullet, index) => ({
    text: bullet,
    options: {
      bullet: { type: "bullet", code: "2022" },
      indentLevel: 0,
    },
  }));
}

// Add image to a slide from the pre-fetched map, with fallback placeholder
function addSlideImage(
  contentSlide: pptxgen.Slide,
  slide: SlideData,
  imageMap: Map<string, string>,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const url = slide.imageUrl || slide.imageAssetId;
  const imageData = url ? imageMap.get(url) : null;

  if (imageData) {
    contentSlide.addImage({
      data: imageData,
      x,
      y,
      w,
      h,
      sizing: { type: "cover", w, h },
      rounding: false,
    });
  } else if (url) {
    // Fallback placeholder if fetch failed
    contentSlide.addShape("rect", {
      x,
      y,
      w,
      h,
      fill: { color: "F3F4F6" },
      line: { color: "D1D5DB", dashType: "dash", width: 1 },
    });
    contentSlide.addText("Image unavailable", {
      x,
      y,
      w,
      h,
      fontSize: 12,
      color: "9CA3AF",
      align: "center",
      valign: "middle",
    });
  }
}

export async function buildDeck(options: BuildDeckOptions): Promise<Buffer> {
  const { project, slides, isFreeTier, userName, orgName } = options;

  // Pre-fetch all images in parallel before building deck
  const imageMap = await prefetchImages(slides);

  const pptx = new pptxgen();

  // Set presentation properties
  pptx.author = userName || "SlideRush AI";
  pptx.title = project.title || project.topic;
  pptx.subject = project.topic;
  pptx.company = orgName || "SlideRush AI";

  // Get template theme
  const templateId = project.templateId || "modern";
  const theme = TEMPLATES[templateId] || TEMPLATES.modern;

  // Define master slide with theme
  const MASTER_SLIDE = "MASTER_SLIDE";

  pptx.defineSlideMaster({
    title: MASTER_SLIDE,
    background: { color: theme.colors.background },
    objects: [
      {
        rect: { x: 0, y: 0, w: "100%", h: 0.15, fill: { color: theme.colors.primary } },
      },
      {
        text: {
          text: orgName || "SlideRush AI",
          options: {
            x: 0.5,
            y: 0.04,
            fontSize: 10,
            color: "FFFFFF",
            fontFace: theme.fonts.body,
          },
        },
      },
    ],
  });

  // Add title slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: theme.colors.primary };
  titleSlide.addText(
    project.title || project.topic,
    {
      x: 1,
      y: 2.5,
      w: "80%",
      fontSize: 44,
      color: "FFFFFF",
      fontFace: theme.fonts.heading,
      align: "center",
      bold: true,
    }
  );

  if (userName) {
    titleSlide.addText(
      `Created by ${userName}`,
      {
        x: 1,
        y: 4,
        w: "80%",
        fontSize: 18,
        color: "FFFFFF",
        fontFace: theme.fonts.body,
        align: "center",
      }
    );
  }

  // Add content slides
  for (const slide of slides) {
    const contentSlide = pptx.addSlide({ masterName: MASTER_SLIDE });

    // Title
    contentSlide.addText(slide.title, {
      x: 0.5,
      y: 0.4,
      w: "90%",
      fontSize: 28,
      color: theme.colors.primary,
      fontFace: theme.fonts.heading,
      bold: true,
    });

    // Determine layout and add content accordingly
    const layout = slide.layout || "content";

    if (layout === "title" || slide.bullets.length === 0) {
      // Title only slide — no additional content
    } else if (layout === "content_image_left" || layout === "image_left") {
      // Image on left, content on right
      addSlideImage(contentSlide, slide, imageMap, 0.5, 1.5, 4.5, 4);
      contentSlide.addText(formatBullets(slide.bullets), {
        x: 5.5,
        y: 1.5,
        w: 4,
        h: 4,
        fontSize: 18,
        color: theme.colors.text,
        fontFace: theme.fonts.body,
        lineSpacingMultiple: 1.5,
      });
    } else if (layout === "content_image_right" || layout === "image_right") {
      // Content on left, image on right
      contentSlide.addText(formatBullets(slide.bullets), {
        x: 0.5,
        y: 1.5,
        w: 4.5,
        h: 4,
        fontSize: 18,
        color: theme.colors.text,
        fontFace: theme.fonts.body,
        lineSpacingMultiple: 1.5,
      });
      addSlideImage(contentSlide, slide, imageMap, 5.5, 1.5, 4, 4);
    } else if (layout === "two_column" || layout === "two_column_content") {
      // Two column layout
      const midpoint = Math.ceil(slide.bullets.length / 2);
      const leftBullets = slide.bullets.slice(0, midpoint);
      const rightBullets = slide.bullets.slice(midpoint);

      contentSlide.addText(formatBullets(leftBullets), {
        x: 0.5,
        y: 1.5,
        w: 4.3,
        h: 4,
        fontSize: 16,
        color: theme.colors.text,
        fontFace: theme.fonts.body,
        lineSpacingMultiple: 1.5,
      });

      contentSlide.addText(formatBullets(rightBullets), {
        x: 5.2,
        y: 1.5,
        w: 4.3,
        h: 4,
        fontSize: 16,
        color: theme.colors.text,
        fontFace: theme.fonts.body,
        lineSpacingMultiple: 1.5,
      });
    } else {
      // Default: content layout (full-width bullets)
      contentSlide.addText(formatBullets(slide.bullets), {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 4,
        fontSize: 18,
        color: theme.colors.text,
        fontFace: theme.fonts.body,
        lineSpacingMultiple: 1.5,
      });

      // If there's an image on a default layout, add it as a smaller image at the bottom-right
      if (slide.imageUrl || slide.imageAssetId) {
        addSlideImage(contentSlide, slide, imageMap, 6.5, 4, 3, 2.5);
      }
    }

    // Add speaker notes if available
    if (slide.speakerNotes) {
      contentSlide.addNotes(slide.speakerNotes);
    }

    // Add watermark for free tier
    if (isFreeTier) {
      contentSlide.addText("Created with SlideRush AI", {
        x: 0,
        y: 7,
        w: "100%",
        fontSize: 10,
        color: "9CA3AF",
        fontFace: theme.fonts.body,
        align: "center",
      });
    }
  }

  // Generate the PPTX as buffer
  const pptxAny = pptx as unknown as { write: (opts: unknown) => Promise<Buffer> };
  const buffer = await pptxAny.write({ type: "nodebuffer" });
  return buffer;
}

export function getTemplateTheme(templateId: string) {
  return TEMPLATES[templateId] || TEMPLATES.modern;
}
