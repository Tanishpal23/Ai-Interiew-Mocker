"use client";

import React, { useEffect, useState, useRef } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { LoaderCircle, Timer, Clock } from "lucide-react";
import { getInterviewDetailsAction } from "@/actions/interview";
import {
  getUserAnswerForQuestionAction,
  saveAndEvaluateAnswerAction,
} from "@/actions/answer";

const TOTAL_TIME_SECONDS = 15 * 60; // 15 seconds for testing (Production: 15 * 60)

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

  // 15-minute countdown timer (reverse from 15:00)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const timerExpiredRef = useRef(false);

  useEffect(() => {
    getInterviewDetails();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!timerExpiredRef.current) {
        timerExpiredRef.current = true;
        toast.error("Time's up! Auto-submitting your interview...");
        handleEndInterview();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getInterviewDetails = async () => {
    const res = await getInterviewDetailsAction(interviewID);
    const data = res?.interviewData;

    if (!data) {
      console.error("No interview found for ID:", interviewID);
      return;
    }

    try {
      let parsed =
        typeof data.jsonMockResp === "string"
          ? JSON.parse(data.jsonMockResp)
          : data.jsonMockResp;

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

    setInterviewData(data);
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
        const res = await getUserAnswerForQuestionAction(
          interviewData.mockId,
          currentQuestion
        );
        setUserAnswer(res?.answer || "");
        setIsSaved(!!res?.isSaved);
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

      const res = await saveAndEvaluateAnswerAction({
        mockId: interviewData.mockId,
        question: currentQuestion,
        correctAns: currentCorrectAns,
        userAnswer: trimmed,
      });

      if (res?.success) {
        setIsSaved(true);
        if (res.isUnattempted) {
          toast.info(`Question ${activeQuestionInd + 1} recorded as unattempted.`);
        } else {
          toast.success(`Question ${activeQuestionInd + 1} answer saved!`);
        }
      } else {
        toast.error(res?.error || "Failed to save answer.");
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
    <div className="p-4 md:p-10 max-w-7xl mx-auto">
      {/* Top Header with Interview Role & 15-Minute Reverse Timer in Top-Right Corner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-800">
            Mock Interview: <span className="text-blue-600">{interviewData?.jobPosition || "Candidate"}</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Answer questions at your own pace. The interview will auto-submit when the timer reaches 00:00.
          </p>
        </div>

        {/* Countdown Timer (Top-Right Corner) */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-semibold transition-all shadow-xs w-fit shrink-0 ${
            timeLeft <= (TOTAL_TIME_SECONDS <= 60 ? 5 : 120)
              ? "bg-red-50 text-red-600 border-red-300 animate-pulse"
              : timeLeft <= (TOTAL_TIME_SECONDS <= 60 ? 10 : 300)
              ? "bg-amber-50 text-amber-700 border-amber-300"
              : "bg-blue-50 text-blue-700 border-blue-200"
          }`}
          title="Interview time remaining"
        >
          <Timer className={`w-4 h-4 ${timeLeft <= (TOTAL_TIME_SECONDS <= 60 ? 5 : 120) ? "text-red-600 animate-spin" : "text-blue-600"}`} />
          <span className="font-mono text-base">{formatTime(timeLeft)}</span>
          <span className="text-[11px] text-gray-500 font-normal">left</span>
        </div>
      </div>

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
