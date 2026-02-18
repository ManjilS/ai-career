"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

export async function generateCareerRoadmap(careerGoal) {
    const prompt = `
    Generate a detailed career roadmap for someone who wants to become a "${careerGoal}".
    Return ONLY valid JSON in the following format, no markdown, no explanation:

    {
      "title": "Career Roadmap: ${careerGoal}",
      "description": "A brief 1-2 sentence description of this career path",
      "stages": [
        {
          "id": "stage-1",
          "label": "Stage Name",
          "type": "stage",
          "level": 0,
          "description": "Brief description of this stage",
          "duration": "e.g. 1-3 months",
          "skills": ["skill1", "skill2", "skill3"],
          "resources": ["resource1", "resource2"],
          "children": ["stage-2"]
        }
      ]
    }

    RULES:
    - Create 6-10 stages that form a logical progression
    - Each stage should have 3-6 skills
    - Each stage should have 2-4 resources (courses, books, platforms)
    - The "children" array should reference the IDs of the next stages
    - The first stage should have level 0, and levels increase as the path progresses
    - Use realistic, specific skill names and resource names
    - Make the roadmap practical and actionable
    - Return ONLY valid JSON, no markdown code blocks
  `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
}
