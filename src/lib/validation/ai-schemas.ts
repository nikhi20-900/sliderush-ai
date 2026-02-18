import { z } from "zod";

/**
 * Schema for individual slide content returned by OpenAI
 */
export const SlideContentSchema = z.object({
    title: z.string().min(1).max(200),
    bullets: z.array(z.string().max(300)).min(1).max(10),
    speakerNotes: z.string().max(2000).optional(),
    layoutHint: z.enum([
        "title",
        "agenda",
        "content",
        "content_image_left",
        "content_image_right",
        "two_column",
        "timeline",
        "summary",
        "qa",
    ]).optional(),
    imageQuery: z.string().max(100).optional(),
});

/**
 * Schema for the full deck outline
 */
export const DeckOutlineSchema = z.object({
    slides: z.array(
        z.object({
            title: z.string().min(1).max(200),
            keyPoints: z.array(z.string().max(300)).min(1).max(8),
            purpose: z.string().max(200).optional(),
            layoutHint: z.enum([
                "title",
                "agenda",
                "content",
                "content_image_left",
                "content_image_right",
                "two_column",
                "timeline",
                "summary",
                "qa",
            ]).optional(),
            imageQuery: z.string().max(100).optional(),
        })
    ).min(1).max(30),
});

/**
 * Schema for topic suggestions
 */
export const TopicSuggestionsSchema = z.array(
    z.string().min(1).max(200)
).min(1).max(10);

/**
 * Schema for rewritten slide content
 */
export const RewrittenContentSchema = z.object({
    title: z.string().min(1).max(200),
    bullets: z.array(z.string().max(300)).min(1).max(10),
    speakerNotes: z.string().max(2000).optional(),
});

/**
 * Schema for panic mode single-pass result
 */
export const PanicDeckSchema = z.object({
    slides: z.array(SlideContentSchema).min(1).max(30),
});

/**
 * Safely parse and validate AI output.
 * Returns the validated data or null with the error logged.
 */
export function parseAIOutput<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    context: string
): T | null {
    const result = schema.safeParse(data);
    if (!result.success) {
        console.error(`AI output validation failed for ${context}:`, result.error.format());
        return null;
    }
    return result.data;
}
