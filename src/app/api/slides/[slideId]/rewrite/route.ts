import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slideId: string }> }
) {
  try {
    const { slideId } = await params;
    const body = await request.json();
    const { intent = "shorter", customPrompt } = body;

    // In a real implementation, you would:
    // 1. Fetch the slide from Firestore
    // 2. Check user plan and quotas
    // 3. Call OpenAI to rewrite
    // 4. Update the slide in Firestore

    // For MVP, return a mock response
    // In production, implement actual AI rewriting

    const prompts: Record<string, string> = {
      shorter: "Make this content more concise while keeping the key points",
      longer: "Expand this content with more detail and examples",
      simpler: "Simplify the language to be more accessible",
      formal: "Rewrite this in a more formal, professional tone",
      add_examples: "Add relevant examples and case studies",
      custom: customPrompt || "Improve this content",
    };

    // Simulate AI response (replace with actual OpenAI call in production)
    const rewrittenContent = {
      title: "Rewritten Slide Title",
      bullets: [
        "Key point 1",
        "Key point 2 with more detail",
        "Key point 3",
      ],
      speakerNotes: "Speaker notes have been updated",
    };

    // Actual implementation would look like:
    /*
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert presentation writer. Rewrite the slide content to be ${intent}.
          Return only valid JSON with keys: title, bullets (array), speakerNotes (optional).
          Keep bullets concise and professional.`,
        },
        {
          role: "user",
          content: `Rewrite this slide:\nTitle: ${slide.title}\nBullets: ${slide.bullets.join('\n')}`,
        },
      ],
      response_format: { type: "json_object" },
    });
    */

    return NextResponse.json({
      success: true,
      rewritten: rewrittenContent,
    });

  } catch (error) {
    console.error("Error rewriting slide:", error);
    return NextResponse.json(
      { error: "Failed to rewrite slide" },
      { status: 500 }
    );
  }
}


