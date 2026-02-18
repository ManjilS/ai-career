"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

export async function chatWithBot(message) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: {
            industry: true,
            skills: true,
            bio: true,
            experience: true,
        },
    });

    if (!user) throw new Error("User not found");

    const profileContext = `
    User Profile:
    - Industry: ${user.industry || "Not specified"}
    - Skills: ${user.skills?.join(", ") || "Not specified"}
    - Experience: ${user.experience || 0} years
    - Bio: ${user.bio || "Not specified"}
  `;

    const prompt = `
    You are an expert AI Career Coach specializing in the user's field.
    
    ${profileContext}
    
    User's Question: "${message}"
    
    Instructions:
    1. Answer the question specifically for this user's profile and industry.
    2. Be encouraging, professional, and concise.
    3. If the question is not related to career, jobs, or professional development, politely redirect the user to career-related topics.
    4. Do not include markdown formatting like headers or bold text unless absolutely necessary for clarity. Keep it conversational.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating chat response:", error);
        throw new Error("Failed to generate response");
    }
}
