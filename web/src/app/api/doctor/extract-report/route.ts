import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the user's hardcoded key as fallback if env var is missing
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyC5s4ts-su6oz7apsyq2EfclmTIhCwUHCw";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");

        // Use gemini-2.5-flash as requested by the user
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
Extract the patient's main medical details from this medical report.
Return ONLY a valid JSON object matching the following structure exactly, prioritizing information present in the image and using empty strings or empty arrays for missing information:
{
  "fullName": "string",
  "age": "string",
  "bloodGroup": "string (e.g., O+, A-)",
  "condition": "string (short 3-5 word summary of the main issue)",
  "notes": "string (brief summary of any relevant notes, precautions, or surgical history)"
}
CRITICAL: Return ONLY valid JSON, without markdown formatting or backticks.
`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: file.type || "image/jpeg"
                }
            }
        ]);

        const textOutput = result.response.text();
        console.log("RAW GEMINI OUTPUT:", textOutput);

        const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("Regex could not find JSON inside response");
            throw new Error("Failed to parse JSON from AI response.");
        }

        const parsedJson = JSON.parse(jsonMatch[0]);
        console.log("PARSED JSON TO RETURN:", parsedJson);

        return NextResponse.json({ data: parsedJson });
    } catch (error: any) {
        console.error("OCR API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to process image" }, { status: 500 });
    }
}
