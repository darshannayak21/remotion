import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const VALID_EXERCISES = [
  "standing_sky_reach", "standing_side_bend_reach", "standing_arm_abduction",
  "standing_row_pull", "standing_knee_raise", "standing_marching",
  "supported_squat", "wall_sit", "standing_toe_raises",
  "standing_forward_leg_raise", "standing_heel_to_butt", "standing_hamstring_curl",
  "standing_hip_extension", "standing_heel_raises", "mini_squat",
  "standing_hip_abduction", "wall_push_ups", "seated_knee_extension",
  "straight_leg_raise", "sit_to_stand", "forward_lunge", "side_lunge",
  "step_back_knee_drive", "single_leg_hip_hinge_supported"
];

export async function POST(req: Request) {
  try {
    const { condition, notes, age, bloodGroup } = await req.json();

    if (!condition) {
      return NextResponse.json({ error: "Missing condition" }, { status: 400 });
    }

    let apiKey = process.env.GROQ_SUGGEST_API_KEY;

    // Explicitly parse the root directory's .env file as requested by the user
    if (!apiKey) {
      try {
        const envPath = path.resolve(process.cwd(), '../.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/^GROQ_SUGGEST_API_KEY=(.*)$/m);
        if (match) {
          apiKey = match[1].trim();
        }
      } catch (err) {
        console.error("Could not explicitly read parent .env configuration", err);
      }
    }

    // Ultimate fallback if missing from root
    if (!apiKey) {
      apiKey = process.env.GROQ_API_KEY || process.env.PATIENT_CHATBOT_API_KEY;
    }

    const prompt = `
You are an expert AI Physiotherapist. A doctor has provided the following patient condition and notes:
Patient Profile: Age ${age || "Unknown"}, Blood Group ${bloodGroup || "Unknown"}
Condition: "${condition}"
Notes: "${notes}"

CRITICAL INSTRUCTIONS:
This app is strictly for POST-PHYSIOTHERAPY and REHABILITATION. 
Based on this patient's age, condition, and the nature of post-rehab recovery, suggest a safe, effective combination of 3 to 6 exercises from the STRICT following list.
DO NOT suggest any exercise that is not on this exact list:
${VALID_EXERCISES.join(", ")}

Return your response ONLY AS JSON. The JSON must have exactly two keys:
1. "reasoning": A 2-3 sentence explanation of why these specific exercises are safe and recommended for this patient's post-physiotherapy recovery.
2. "suggestedExerciseIds": A JSON array of strings containing the exact IDs from the list above.

CRITICAL: Return ONLY valid JSON block with no markdown wrappers or extra text.
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Fast/smart Llama 3.3 model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2, // Low temp for more deterministic array output
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API Error:", errText);

      let parsedErr = "Groq API failed to suggest exercises";
      try {
        const jsonBody = JSON.parse(errText);
        if (jsonBody.error && jsonBody.error.message) {
          parsedErr = jsonBody.error.message;
        }
      } catch (e) { }

      return NextResponse.json({ error: parsedErr }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "Failed to parse suggestions from AI" }, { status: 500 });
    }

    try {
      const parsed = JSON.parse(content);

      // Filter out any hallucinated IDs just in case
      let validIds = parsed.suggestedExerciseIds || [];
      if (!Array.isArray(validIds)) validIds = [];
      validIds = validIds.filter((id: string) => VALID_EXERCISES.includes(id));

      return NextResponse.json({
        reasoning: parsed.reasoning || "Based on the diagnosis, these exercises are recommended.",
        suggestedExerciseIds: validIds,
      });
    } catch (parseErr) {
      console.error("Failed to parse Groq JSON:", content);
      return NextResponse.json(
        { error: "Model returned invalid JSON format" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Suggest Exercises Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
