"use server";

import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import generateAIResponse from "@/utils/GeminiAIModal";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq, inArray, or } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

/**
 * Creates a new mock interview by calling Gemini AI on the server
 * and storing the interview metadata and questions in Neon DB.
 */
export async function createInterviewAction({
  jobPosition,
  jobDesc,
  jobExperience,
  difficulty = "Mid-Level",
  interviewFocus = "Technical & Coding",
}) {
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress || "anonymous";

    const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}, Target Interview Difficulty Level: ${difficulty}, Specific Interview Focus: ${interviewFocus}.
Depending on this information, please give us 5 interview questions with answers in JSON format.
Give Question and Answer fields in JSON.
Ensure the difficulty and depth of the questions strictly match the requested experience (${jobExperience} years), difficulty tier (${difficulty}), and focus area (${interviewFocus}).

Return ONLY valid JSON array with 5 items.
Example format:
[
  {
    "question": "Your question here?",
    "answer": "Ideal model answer here"
  }
]`;

    const aiRawResponse = await generateAIResponse(inputPrompt);
    let cleaned = aiRawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();

    // Verify it parses as valid JSON
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (match) {
        cleaned = match[0];
        parsed = JSON.parse(cleaned);
      } else {
        throw new Error("Failed to parse Gemini response as JSON array");
      }
    }

    const newMockId = uuidv4();

    const resp = await db
      .insert(MockInterview)
      .values({
        mockId: newMockId,
        jsonMockResp: cleaned,
        jobPosition: jobPosition || "N/A",
        jobDesc: jobDesc || "N/A",
        jobExperience: jobExperience || "0",
        createdBy: userEmail,
        createdAt: moment().format("DD-MM-YYYY"),
      })
      .returning({ mockId: MockInterview.mockId });

    return {
      success: true,
      mockId: resp[0]?.mockId || newMockId,
    };
  } catch (error) {
    console.error("Error in createInterviewAction:", error);
    return {
      success: false,
      error: error.message || "Failed to generate interview",
    };
  }
}

/**
 * Retrieves all mock interviews created by the logged-in user,
 * along with their recorded answers for analytics calculations.
 */
export async function getUserInterviewsAction() {
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return { interviewList: [], userAnswers: [] };
    }

    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, userEmail))
      .orderBy(desc(MockInterview.id));

    const interviewList = result || [];
    const mockIds = interviewList.map((i) => i.mockId).filter(Boolean);

    let answers = [];
    if (mockIds.length > 0) {
      answers = await db
        .select()
        .from(UserAnswer)
        .where(
          or(
            eq(UserAnswer.userEmail, userEmail),
            inArray(UserAnswer.mockIdRef, mockIds)
          )
        );
    } else {
      answers = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.userEmail, userEmail));
    }

    return {
      interviewList,
      userAnswers: answers || [],
    };
  } catch (error) {
    console.error("Error in getUserInterviewsAction:", error);
    return { interviewList: [], userAnswers: [], error: error.message };
  }
}

/**
 * Fetches single interview details by mockId.
 */
export async function getInterviewDetailsAction(mockId) {
  try {
    if (!mockId) return { interviewData: null };

    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, mockId));

    return { interviewData: result[0] || null };
  } catch (error) {
    console.error("Error in getInterviewDetailsAction:", error);
    return { interviewData: null, error: error.message };
  }
}

/**
 * Deletes an interview and all associated candidate answers.
 */
export async function deleteInterviewAction(mockId) {
  try {
    if (!mockId) throw new Error("Mock ID is required");

    // 1. Delete all user answers associated with this interview
    await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, mockId));

    // 2. Delete the mock interview itself
    await db.delete(MockInterview).where(eq(MockInterview.mockId, mockId));

    return { success: true };
  } catch (error) {
    console.error("Error in deleteInterviewAction:", error);
    return { success: false, error: error.message };
  }
}
