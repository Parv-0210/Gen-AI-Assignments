import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getPersonaById } from "@/lib/personas";

export async function POST(req: NextRequest) {
  try {
    const { messages, personaId } = await req.json();

    if (!messages || !personaId) {
      return NextResponse.json(
        { error: "Missing messages or personaId" },
        { status: 400 }
      );
    }

    const persona = getPersonaById(personaId);
    if (!persona) {
      return NextResponse.json(
        { error: "Invalid persona ID" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Please set GEMINI_API_KEY in your environment." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      systemInstruction: persona.systemPrompt,
    });

    // Build history (all messages except the last one)
    const history = messages.slice(0, -1).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "assistant",
        parts: [{ text: msg.content }],
      })
    );

    const chat = model.startChat({ history });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error:
          "Something went wrong while contacting the AI. Please try again.",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
