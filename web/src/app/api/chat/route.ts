import { NextResponse } from "next/server";
import { EXERCISES } from "@/data/exerciseData";

const SYSTEM_PROMPT = `You are Flex, a friendly, highly professional, and encouraging AI Physiotherapy Assistant for the ReMotion app.
You are chatting with a patient in their dashboard.

YOUR GOALS:
1. Answer their general questions about physiotherapy, recovery, posture, and wellness.
2. Suggest specific exercises from our library when appropriate.
3. Be empathetic, encouraging, and clear.
4. Keep your responses structured, using markdown, bullet points, and concise paragraphs to enhance readability.

CRITICAL INSTRUCTION:
When you suggest exercises, YOU MUST use the exact ID of the exercise from our library. We have a set of exercises available.
Here are the available exercises in our library, along with their names, descriptions, and categories:
${EXERCISES.map(ex => `- ID: "${ex.id}" | Name: "${ex.name}" | Category: ${ex.category} | Description: ${ex.description}`).join("\n")}

If a user asks for exercise suggestions (e.g., "my knees hurt, what should I do?" or "show me some stretches"), you should:
1. Provide some general advice and empathy.
2. Recommend 1-3 specific exercises from our library by explicitly saying: "Here are some exercises you can try from your library:"
3. Then list them.

You MUST only ever recommend exercises that appear in the list above. DO NOT invent exercise IDs. DO NOT recommend exercises we don't have.

Respond in a conversational, helpful tone. Keep it relatively concise but highly informative. Use friendly emojis where appropriate!
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    let apiKey = process.env.GROQ_SUGGEST_API_KEY;
    
    // Automatically fallback to reading the parent d:\pose\.env file at runtime 
    // since Next.js normally ignores parent directories for env files.
    if (!apiKey) {
      try {
        const fs = require('fs');
        const path = require('path');
        const envPath = path.resolve(process.cwd(), "..", ".env");
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, "utf-8");
          const match = envContent.match(/GROQ_SUGGEST_API_KEY=(.+)/);
          if (match && match[1]) {
            apiKey = match[1].trim();
            console.log("Loaded GROQ_SUGGEST_API_KEY from root .env successfully");
          }
        }
      } catch (e) {
        console.warn("Failed to read from root .env:", e);
      }
    }

    if (!apiKey) {
      console.error("GROQ_SUGGEST_API_KEY is not set in process.env or the root .env file");
      return NextResponse.json({ error: "Chatbot is not configured" }, { status: 500 });
    }

    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      }))
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        temperature: 0.6,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq Chat API Error:", errText);
      return NextResponse.json({ error: "Failed to generate response" }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
    }

    return NextResponse.json({ content });

  } catch (error) {
    console.error("Chatbot Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
