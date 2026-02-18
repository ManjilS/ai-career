"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // Check if industry insight exists first to generate AI insights if needed
    let industryInsight = await db.industryInsight.findUnique({
      where: {
        industry: data.industry,
      },
    });

    let insights;
    if (!industryInsight) {
      insights = await generateAIInsights(data.industry);
    }

    // Start a transaction to handle both operations
    const result = await db.$transaction(
      async (tx) => {
        // Check again if industry exists (race condition)
        if (!industryInsight) {
          industryInsight = await tx.industryInsight.findUnique({
            where: {
              industry: data.industry,
            },
          });
        }

        // If it still doesn't exist, create it
        if (!industryInsight && insights) {
          industryInsight = await tx.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // Now update the user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000,
      }
    );

    revalidatePath("/");
    return result.user;
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        industry: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      isOnboarded: !!user.industry,
    };
  } catch (error) {
    if (error.message === "User not found") throw error;
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
