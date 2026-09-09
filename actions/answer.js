"use server";

import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import generateAIResponse from "@/utils/GeminiAIModal";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import moment from "moment";

/**
 * Loads previously saved candidate answer for a specific interview question.
 */
export async function getUserAnswerForQuestionAction(mockId, question) {
  try {
    if (!mockId || !question) {
      return { answer: "", isSaved: false };
    }

    const existing = await db
      .select()
      .from(UserAnswer)
      .where(
        and(
          eq(UserAnswer.mockIdRef, mockId),
          eq(UserAnswer.question, question)
        )
      );

    if (existing && existing.length > 0) {
      const ans = existing[0].userAnswer || "";
      return {
        answer: ans === "answer unattempted" ? "" : ans,
        isSaved: true,
      };
    }

    return { answer: "", isSaved: false };
  } catch (error) {
    console.error("Error in getUserAnswerForQuestionAction:", error);
    return { answer: "", isSaved: false, error: error.message };
  }
}

/**
 * Evaluates candidate answer via Gemini AI on the server and persists
 * the answer, rating, and feedback to the Neon PostgreSQL database.
 */
export async function saveAndEvaluateAnswerAction({
  mockId,
  question,
  correctAns,
  userAnswer,
}) {
  try {
    if (!mockId || !question) {
      throw new Error("mockId and question are required");
    }

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress || "anonymous";
    const trimmed = (userAnswer || "").trim();

    let finalUserAnswer = trimmed;
    let finalFeedback = "Question was not attempted.";
    let finalRating = "0";

    if (!trimmed || trimmed.toLowerCase() === "answer unattempted") {
      finalUserAnswer = "answer unattempted";
      finalFeedback = "Question was not attempted.";
      finalRating = "0";
    } else {
      // Prompt Gemini on the server for rating and constructive feedback
      const feedbackPrompt = `Interview Question: "${question}"
Candidate Answer: "${trimmed}"
Based on the question and candidate's answer, provide a rating (e.g. "7/10" or "8") and constructive feedback (3-5 lines covering areas of improvement and strengths) in JSON format with "rating" and "feedback" fields.
Return ONLY valid JSON.
Example JSON:
{
  "rating": "7/10",
  "feedback": "Clear explanation. To improve, discuss state management and edge cases."
}`;

      try {
        const aiRawResponse = await generateAIResponse(feedbackPrompt);
        let cleaned = aiRawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) cleaned = jsonMatch[0];

        const parsed = JSON.parse(cleaned);
        finalRating = String(parsed.rating || "5/10");
        finalFeedback = String(
          parsed.feedback ||
            parsed.Feedback ||
            "Good effort. Focus on technical specifics."
        );
      } catch (aiErr) {
        console.warn("AI evaluation parsing error:", aiErr);
        finalRating = "5/10";
        finalFeedback = "Answer recorded. AI evaluation timed out.";
      }
    }

    // Check if a record already exists for this (mockId, question)
    const existing = await db
      .select()
      .from(UserAnswer)
      .where(
        and(
          eq(UserAnswer.mockIdRef, mockId),
          eq(UserAnswer.question, question)
        )
      );

    if (existing && existing.length > 0) {
      await db
        .update(UserAnswer)
        .set({
          userAnswer: finalUserAnswer,
          feedback: finalFeedback,
          rating: finalRating,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .where(eq(UserAnswer.id, existing[0].id));
    } else {
      await db.insert(UserAnswer).values({
        mockIdRef: mockId,
        question: question,
        correctAns: correctAns || "N/A",
        userAnswer: finalUserAnswer,
        feedback: finalFeedback,
        rating: finalRating,
        userEmail: userEmail,
        createdAt: moment().format("DD-MM-YYYY"),
      });
    }

    return {
      success: true,
      rating: finalRating,
      feedback: finalFeedback,
      isUnattempted: finalUserAnswer === "answer unattempted",
    };
  } catch (error) {
    console.error("Error in saveAndEvaluateAnswerAction:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Retrieves all evaluated answers and interview metadata for the feedback report.
 */
export async function getFeedbackReportAction(mockId) {
  try {
    if (!mockId) {
      return { feedbackList: [], interviewInfo: null };
    }

    const [feedbackList, interviewRows] = await Promise.all([
      db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, mockId))
        .orderBy(UserAnswer.id),
      db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, mockId)),
    ]);

    return {
      feedbackList: feedbackList || [],
      interviewInfo: interviewRows?.[0] || null,
    };
  } catch (error) {
    console.error("Error in getFeedbackReportAction:", error);
    return { feedbackList: [], interviewInfo: null, error: error.message };
  }
}
