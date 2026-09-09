"use server";

import { db } from "@/utils/db";
import { UserAskedQuestion } from "@/utils/schema";
import generateAIResponse from "@/utils/GeminiAIModal";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import moment from "moment";

/**
 * Retrieves all custom asked questions saved by the current user.
 */
export async function getUserAskedQuestionsAction() {
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return { savedQuestions: [] };
    }

    const result = await db
      .select()
      .from(UserAskedQuestion)
      .where(eq(UserAskedQuestion.userEmail, userEmail))
      .orderBy(desc(UserAskedQuestion.id));

    return { savedQuestions: result || [] };
  } catch (error) {
    console.error("Error in getUserAskedQuestionsAction:", error);
    return { savedQuestions: [], error: error.message };
  }
}

/**
 * Generates an expert model answer via Gemini AI on the server and persists
 * the question and answer to Neon DB.
 */
export async function askAndSaveQuestionAction(questionText) {
  try {
    const trimmed = (questionText || "").trim();
    if (!trimmed) {
      throw new Error("Question text cannot be empty");
    }

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress || "anonymous";

    const prompt = `You are an expert technical interviewer. Provide a clear, comprehensive, and accurate model answer for the following interview question:

Question: "${trimmed}"

Explain key concepts, real-world context, and best practices in a structured manner suitable for a technical interview.`;

    const aiResponse = await generateAIResponse(prompt);

    const resp = await db
      .insert(UserAskedQuestion)
      .values({
        question: trimmed,
        answer: aiResponse,
        userEmail: userEmail,
        createdAt: moment().format("DD-MM-YYYY"),
      })
      .returning();

    return {
      success: true,
      answer: aiResponse,
      savedQuestion: resp[0] || null,
    };
  } catch (error) {
    console.error("Error in askAndSaveQuestionAction:", error);
    return {
      success: false,
      error: error.message || "Failed to generate answer",
    };
  }
}

/**
 * Deletes a custom asked question by ID.
 */
export async function deleteUserAskedQuestionAction(id) {
  try {
    if (!id) throw new Error("Question ID is required");

    await db
      .delete(UserAskedQuestion)
      .where(eq(UserAskedQuestion.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error in deleteUserAskedQuestionAction:", error);
    return { success: false, error: error.message };
  }
}
