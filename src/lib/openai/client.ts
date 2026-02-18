import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

export interface SlideContent {
  title: string;
  bullets: string[];
  speakerNotes?: string;
  layoutHint?: string;
  imageQuery?: string;
}

export interface DeckOutline {
  slides: {
    title: string;
    keyPoints: string[];
    purpose?: string;
    layoutHint?: string;
    imageQuery?: string;
  }[];
}

export async function generateOutline(
  topic: string,
  slideCount: number,
  templateId: string,
  audience?: string,
  tone?: string
): Promise<DeckOutline> {
  const systemPrompt = `You are an expert presentation designer. Create a concise outline for a presentation.
  
  Guidelines:
  - Create exactly ${slideCount} slides
  - First slide should be a title slide
  - Last slide should be a conclusion/Q&A slide
  - Each slide should have 2-5 key points
  - Keep titles under 80 characters
  - Keep points concise and actionable
  - Consider the audience: ${audience || "general"}
  - Tone: ${tone || "professional"}
  - Template style: ${templateId}
  
  Return ONLY valid JSON matching this schema:
  {
    "slides": [
      {
        "title": "string",
        "keyPoints": ["string"],
        "purpose": "string (optional)",
        "layoutHint": "title|agenda|content_image_left|content_image_right|two_column|timeline|summary|qa",
        "imageQuery": "string (optional)"
      }
    ]
  }`;

  const userPrompt = `Create a ${slideCount}-slide presentation outline about: "${topic}"
  
  Return the complete outline as JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);

  return {
    slides: parsed.slides || [],
  };
}

export async function generateSlideContent(
  slideOutline: DeckOutline["slides"][0]
): Promise<SlideContent> {
  const systemPrompt = `You are an expert presentation content writer. Expand slide outlines into detailed content.
  
  Guidelines:
  - Expand each point into 1-2 sentences
  - Keep bullet points concise (under 140 characters each)
  - Add speaker notes (optional, under 800 characters)
  - Suggest an image query for Unsplash if relevant
  - Return ONLY valid JSON matching this schema:
  {
    "title": "string",
    "bullets": ["string"],
    "speakerNotes": "string (optional)",
    "layoutHint": "title|agenda|content_image_left|content_image_right|two_column|timeline|summary|qa",
    "imageQuery": "string (optional)"
  }`;

  const userPrompt = `Expand this slide outline into full content:
  Title: ${slideOutline.title}
  Key Points: ${slideOutline.keyPoints.join(", ")}
  Layout: ${slideOutline.layoutHint || "content_image_right"}
  
  Return the complete slide content as JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content || "{}";
  return JSON.parse(content);
}

export async function rewriteSlide(
  currentContent: SlideContent,
  intent: string,
  customPrompt?: string
): Promise<SlideContent> {
  const intentPrompts: Record<string, string> = {
    shorter: "Make the content more concise, reducing the number of points",
    longer: "Add more detail and examples to each point",
    simpler: "Simplify the language for a general audience",
    formal: "Make the tone more professional and formal",
    casual: "Make the tone more conversational and friendly",
    add_examples: "Add practical examples to illustrate each point",
  };

  const systemPrompt = `You are an expert presentation editor. Rewrite slide content based on the specified intent.
  
  Guidelines:
  - Maintain the same number of bullet points (3-6)
  - Keep titles under 80 characters
  - Keep bullets under 140 characters
  - Preserve the layout and structure
  - Return ONLY valid JSON matching this schema:
  {
    "title": "string",
    "bullets": ["string"],
    "speakerNotes": "string (optional)"
  }`;

  const userPrompt = `Current slide content:
  Title: ${currentContent.title}
  Bullets: ${currentContent.bullets.join("\n")}
  Speaker Notes: ${currentContent.speakerNotes || "none"}
  
  Intent: ${intentPrompts[intent] || customPrompt || "Improve the content"}
  
  Return the rewritten content as JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content || "{}";
  return JSON.parse(content);
}

export async function suggestTopics(userInput: string): Promise<string[]> {
  const systemPrompt = `You are a creative brainstorming assistant. Generate relevant presentation topics.
  
  Guidelines:
  - Generate 3-5 topic variations based on user input
  - Make topics specific and actionable
  - Keep topics under 100 characters
  - Return ONLY a JSON array of strings`;

  const userPrompt = `Generate presentation topic suggestions for: "${userInput}"
  
  Return a JSON array of 3-5 relevant topics.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);

  // Handle both array directly and wrapped in topics key
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.topics)) return parsed.topics;
  if (Array.isArray(parsed.suggestions)) return parsed.suggestions;

  return [];
}

/**
 * Panic Mode: Single-pass generation that produces both outline and content
 * in a single API call for maximum speed. Targets 10-20 second SLA.
 */
export async function generatePanicDeck(
  topic: string,
  slideCount: number,
  templateId: string,
  audience?: string,
  tone?: string
): Promise<SlideContent[]> {
  const systemPrompt = `You are an expert presentation designer working under extreme time pressure.
  Generate a COMPLETE presentation with ${slideCount} slides in a SINGLE response.
  
  Rules:
  - First slide: title slide
  - Last slide: conclusion/Q&A
  - Each slide: clear title, 2-4 concise bullet points
  - Keep everything brief and impactful
  - Use simple layouts: title, content_image_right, two_column, or content
  - Audience: ${audience || "general"}
  - Tone: ${tone || "professional"}

  Return ONLY valid JSON: { "slides": [{ "title": "...", "bullets": ["..."], "layoutHint": "...", "imageQuery": "..." }] }`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Create a ${slideCount}-slide presentation about: "${topic}"` },
    ],
    temperature: 0.8,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);

  return (parsed.slides || []).map((slide: Record<string, unknown>) => ({
    title: slide.title as string || "",
    bullets: (slide.bullets as string[]) || [],
    speakerNotes: undefined,
    layoutHint: slide.layoutHint as string || "content",
    imageQuery: slide.imageQuery as string || undefined,
  }));
}

export default openai;

