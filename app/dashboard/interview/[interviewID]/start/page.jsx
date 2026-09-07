"use client";

import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import generateAIResponseStream from "@/utils/GeminiAIModal";
import moment from "moment";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

const StartInterview = ({ params }) => {
  const resolvedParams = React.use(params);
  const interviewID = resolvedParams?.interviewID ?? null;

  const router = useRouter();
  const { user } = useUser();

  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionInd, setActiveQuestionInd] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    getInterviewDetails();
  }, []);

  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewID));

    // ✅ SAFETY CHECK
    if (!result || result.length === 0) {
      console.error("No interview found for ID:", interviewID);
      return;
    }

    try {
      let parsed =
        typeof result[0].jsonMockResp === "string"
          ? JSON.parse(result[0].jsonMockResp)
          : result[0].jsonMockResp;

      if (!Array.isArray(parsed) && parsed && typeof parsed === "object") {
        const candidateArray =
          parsed.questions ||
          parsed.interviewQuestions ||
          parsed.interview_questions ||
          Object.values(parsed).find(Array.isArray);
        if (Array.isArray(candidateArray)) {
          parsed = candidateArray;
        }
      }

      console.log("Loaded interview questions:", parsed);
      setMockInterviewQuestion(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error("Error parsing jsonMockResp:", err);
      setMockInterviewQuestion([]);
    }

    setInterviewData(result[0]);
  };

  const currentQuestion =
    mockInterviewQuestion?.[activeQuestionInd]?.question ||
    mockInterviewQuestion?.[activeQuestionInd]?.Question ||
    "";

  const currentCorrectAns =
    mockInterviewQuestion?.[activeQuestionInd]?.answer ||
    mockInterviewQuestion?.[activeQuestionInd]?.Answer ||
    mockInterviewQuestion?.[activeQuestionInd]?.ans ||
    "";

  // Load existing answer whenever active question changes
  useEffect(() => {
    if (!interviewData?.mockId || !currentQuestion) return;

    const loadAnswer = async () => {
      try {
        const existing = await db
          .select()
          .from(UserAnswer)
          .where(
            and(
              eq(UserAnswer.mockIdRef, interviewData.mockId),
              eq(UserAnswer.question, currentQuestion)
            )
          );

        if (existing && existing.length > 0) {
          const ans = existing[0].userAnswer || "";
          setUserAnswer(ans === "answer unattempted" ? "" : ans);
          setIsSaved(true);
        } else {
          setUserAnswer("");
          setIsSaved(false);
        }
      } catch (err) {
        console.error("Error fetching existing answer:", err);
      }
    };

    loadAnswer();
  }, [activeQuestionInd, currentQuestion, interviewData?.mockId]);

  // Saves current question answer: if empty -> saves "answer unattempted" with rating 0
  const saveAnswer = async (answerText) => {
    if (!currentQuestion || !interviewData?.mockId) return;

    const trimmed = (answerText !== undefined ? answerText : userAnswer)?.trim() || "";

    try {
      setLoading(true);

      let finalUserAnswer = trimmed;
      let finalFeedback = "Question was not attempted.";
      let finalRating = "0";

      // If answer is empty or "answer unattempted"
      if (!trimmed || trimmed.toLowerCase() === "answer unattempted") {
        finalUserAnswer = "answer unattempted";
        finalFeedback = "Question was not attempted.";
        finalRating = "0";
      } else {
        // Candidate provided answer -> evaluate with Gemini AI
        const feedbackPrompt = `Interview Question: "${currentQuestion}"
Candidate Answer: "${trimmed}"
Based on the question and candidate's answer, provide a rating (e.g. "7/10" or "8") and constructive feedback (3-5 lines covering areas of improvement and strengths) in JSON format with "rating" and "feedback" fields.
Return ONLY valid JSON.
Example JSON:
{
  "rating": "7/10",
  "feedback": "Clear explanation. To improve, discuss state management and edge cases."
}`;

        try {
          const aiRawResponse = await generateAIResponseStream(feedbackPrompt);
          let cleaned = aiRawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
          const firstCurly = cleaned.indexOf("{");
          const lastCurly = cleaned.lastIndexOf("}");
          if (firstCurly !== -1 && lastCurly !== -1 && firstCurly < lastCurly) {
            cleaned = cleaned.substring(firstCurly, lastCurly + 1);
          }
          const parsedFeedback = JSON.parse(cleaned);
          finalRating = String(parsedFeedback?.rating ?? "7/10");
          finalFeedback =
            typeof parsedFeedback?.feedback === "object"
              ? JSON.stringify(parsedFeedback.feedback)
              : String(parsedFeedback?.feedback || "Answer recorded.");
        } catch (err) {
          console.warn("AI evaluation fallback:", err);
          finalRating = "7/10";
          finalFeedback = "Answer recorded successfully. Good effort!";
        }
      }

      // Check if already in DB
      const existing = await db
        .select()
        .from(UserAnswer)
        .where(
          and(
            eq(UserAnswer.mockIdRef, interviewData.mockId),
            eq(UserAnswer.question, currentQuestion)
          )
        );

      if (existing && existing.length > 0) {
        await db
          .update(UserAnswer)
          .set({
            userAnswer: finalUserAnswer,
            correctAns: currentCorrectAns,
            feedback: finalFeedback,
            rating: finalRating,
            createdAt: moment().format("DD-MM-YYYY"),
          })
          .where(eq(UserAnswer.id, existing[0].id));
      } else {
        await db.insert(UserAnswer).values({
          mockIdRef: interviewData.mockId,
          question: currentQuestion,
          correctAns: currentCorrectAns,
          userAnswer: finalUserAnswer,
          feedback: finalFeedback,
          rating: finalRating,
          userEmail: user?.primaryEmailAddress?.emailAddress || "anonymous",
          createdAt: moment().format("DD-MM-YYYY"),
        });
      }

      setIsSaved(true);
      if (finalUserAnswer === "answer unattempted") {
        toast.info(`Question ${activeQuestionInd + 1} recorded as unattempted.`);
      } else {
        toast.success(`Question ${activeQuestionInd + 1} answer saved!`);
      }
    } catch (err) {
      console.error("Error saving answer to DB:", err);
      toast.error("Failed to save answer to database.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    await saveAnswer(userAnswer);
    if (activeQuestionInd < (mockInterviewQuestion?.length || 0) - 1) {
      setActiveQuestionInd((prev) => prev + 1);
    }
  };

  const handlePrevious = async () => {
    await saveAnswer(userAnswer);
    if (activeQuestionInd > 0) {
      setActiveQuestionInd((prev) => prev - 1);
    }
  };

  const handleSelectQuestion = async (targetInd) => {
    if (targetInd === activeQuestionInd) return;
    await saveAnswer(userAnswer);
    setActiveQuestionInd(targetInd);
  };

  const handleEndInterview = async () => {
    await saveAnswer(userAnswer);
    router.push(`/dashboard/interview/${interviewData?.mockId}/feedback`);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionInd={activeQuestionInd}
          setActiveQuestionInd={handleSelectQuestion}
        />

        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionInd={activeQuestionInd}
          interviewData={interviewData}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          loading={loading}
          isSaved={isSaved}
          setIsSaved={setIsSaved}
          saveAnswer={saveAnswer}
          handleNext={handleNext}
        />
      </div>

      <div className="flex justify-end gap-4 mt-8">
        {activeQuestionInd > 0 && (
          <Button
            disabled={loading}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={handlePrevious}
          >
            Previous
          </Button>
        )}

        {activeQuestionInd !== (mockInterviewQuestion?.length || 0) - 1 && (
          <Button
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            onClick={handleNext}
          >
            {loading && <LoaderCircle className="w-4 h-4 animate-spin" />}
            Next Question
          </Button>
        )}

        {activeQuestionInd === (mockInterviewQuestion?.length || 0) - 1 && (
          <Button
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            onClick={handleEndInterview}
          >
            {loading && <LoaderCircle className="w-4 h-4 animate-spin" />}
            End Interview
          </Button>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
