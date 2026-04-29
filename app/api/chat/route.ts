import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getPersonaById } from "@/lib/personas";

const OPENAI_MODEL = "gpt-3.5-turbo";

async function callOpenAI(messages: Array<{ role: string; content: string }>, personaPrompt: string, apiKey: string) {
  const payload = {
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: personaPrompt },
      ...messages.map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })),
    ],
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content ?? "";
}

async function callGemini(messages: Array<{ role: string; content: string }>, personaPrompt: string, apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
    systemInstruction: personaPrompt,
  });

  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === "user" ? "user" : "assistant",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history });
  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  const response = await result.response;
  return response.text();
}

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

    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!openaiKey && !geminiKey) {
      return NextResponse.json(
        {
          error:
            "API key not configured. Please set OPENAI_API_KEY or GEMINI_API_KEY in your environment.",
        },
        { status: 500 }
      );
    }

    let text: string;

    if (openaiKey) {
      text = await callOpenAI(messages, persona.systemPrompt, openaiKey);
    } else {
      text = await callGemini(messages, persona.systemPrompt, geminiKey!);
    }

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
