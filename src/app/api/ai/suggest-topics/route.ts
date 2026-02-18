import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a creative assistant that helps users refine their presentation topics.
Generate 5 creative variations of the given topic.
Return ONLY a JSON array of strings, no other text.
Each variation should be clear, specific, and engaging.`,
        },
        {
          role: "user",
          content: `Generate 5 presentation topic variations for: "${topic}"`,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || "[]";
    
    // Parse the JSON response
    let suggestions: string[] = [];
    try {
      suggestions = JSON.parse(content);
    } catch {
      // If parsing fails, try to extract array from response
      const match = content.match(/\[.*\]/);
      if (match && match[0]) {
        try {
          suggestions = JSON.parse(match[0]);
        } catch {
          // Return empty array if all parsing fails
          suggestions = [];
        }
      }
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error generating topic suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}


