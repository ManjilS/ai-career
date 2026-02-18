"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});

/* ---------- SAFE JSON PARSER ---------- */
function safeJsonParse(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Invalid JSON returned from AI");
  }
  return JSON.parse(match[0]);
}

/* ---------- TEXT RESUME ANALYSIS ---------- */
export async function analyzeResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { resume: true },
  });

  if (!user) throw new Error("User not found");
  if (!user.resume) throw new Error("No resume found");

  const prompt = `
Analyze the following resume for a ${user.industry} professional.

Resume Content:
${user.resume.content}

Return ONLY valid JSON:
{
  "atsScore": number,
  "keywordMatch": number,
  "readabilityScore": number,
  "industryMatch": string,
  "categoryScores": [
    { "name": string, "score": number, "feedback": string }
  ],
  "missingKeywords": string[],
  "presentKeywords": string[],
  "suggestedCompanies": string[],
  "uniqueStrengths": string[],
  "quickWins": [
    { "title": string, "description": string }
  ],
  "improvements": [
    {
      "title": string,
      "priority": "high" | "medium" | "low",
      "description": string,
      "examples": string
    }
  ],
  "feedback": string
}
`;

  try {
    const result = await model.generateContent(prompt);
    const analysis = safeJsonParse(result.response.text());

    await db.resume.update({
      where: { id: user.resume.id },
      data: {
        atsScore: analysis.atsScore,
        feedback: analysis.feedback,
      },
    });

    revalidatePath("/resume");
    return analysis;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to analyze resume");
  }
}

/* ---------- IMAGE RESUME ANALYSIS ---------- */
export async function analyzeResumeImage(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const imageFile = formData.get("resume-image");
  if (!imageFile) throw new Error("No image uploaded");
  if (!imageFile.type.startsWith("image/")) {
    throw new Error("Invalid file type");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
Analyze this resume image for a ${user.industry} professional.

Return ONLY valid JSON:
{
  "atsScore": number,
  "keywordMatch": number,
  "readabilityScore": number,
  "industryMatch": string,
  "categoryScores": [
    { "name": string, "score": number, "feedback": string }
  ],
  "missingKeywords": string[],
  "presentKeywords": string[],
  "suggestedCompanies": string[],
  "uniqueStrengths": string[],
  "quickWins": [
    { "title": string, "description": string }
  ],
  "improvements": [
    {
      "title": string,
      "priority": "high" | "medium" | "low",
      "description": string,
      "examples": string
    }
  ],
  "feedback": string,
  "extractedContent": string
}
`;

  try {
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: imageFile.type,
        },
      },
    ]);

    return safeJsonParse(result.response.text());
  } catch (error) {
    console.error(error);
    throw new Error("Failed to analyze resume image");
  }
}
