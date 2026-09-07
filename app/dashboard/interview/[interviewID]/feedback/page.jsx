"use client";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewID))
        .orderBy(UserAnswer.id);

      console.log("Feedback list loaded:", result);
      setFeedbackList(result);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  // Calculate overall average rating from all interview questions
  const overallRating = useMemo(() => {
    if (!feedbackList || feedbackList.length === 0) return 0;
    let totalScore = 0;

    feedbackList.forEach((item) => {
      if (item?.rating) {
        // Parse the numeric score (handles formats like "7/10", "8", "6.5")
        const match = String(item.rating).match(/([0-9]+(?:\.[0-9]+)?)/);
        if (match) {
          totalScore += parseFloat(match[1]);
        }
      }
    });

    const avg = totalScore / feedbackList.length;
    return avg % 1 === 0 ? avg.toFixed(0) : avg.toFixed(1);
  }, [feedbackList]);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      {feedbackList?.length === 0 ? (
        <h2 className="font-bold text-xl text-gray-500">
          No Interview Feedback Record Found.
        </h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-600">
            Congratulations!
          </h2>

          <h2 className="font-bold text-2xl mt-1">
            Here is your interview feedback
          </h2>

          {/* Average Rating displayed on top right after headings */}
          <h2 className="text-lg my-3 text-gray-700">
            Your overall interview rating:{" "}
            <strong
              className={`text-xl font-bold ${
                Number(overallRating) >= 7
                  ? "text-green-600"
                  : Number(overallRating) >= 4
                  ? "text-amber-600"
                  : "text-red-600"
              }`}
            >
              {overallRating}/10
            </strong>
          </h2>

          <h2 className="text-sm text-gray-500 mb-6">
            Find below interview question with correct answer, your answer, and
            feedback for improvement:
          </h2>

          {feedbackList.map((item, index) => {
            const isUnattempted = item.userAnswer === "answer unattempted";

            return (
              <Collapsible key={index} className="mt-4">
                <CollapsibleTrigger className="w-full p-3 bg-secondary rounded-lg flex justify-between items-center my-2 text-left gap-4 hover:bg-gray-200 transition-colors">
                  <span className="font-medium text-gray-900">
                    Question {index + 1}: {item.question}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        isUnattempted
                          ? "bg-amber-100 text-amber-800"
                          : Number(String(item.rating).match(/\d+/)?.[0] || 0) >= 7
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isUnattempted ? "Unattempted" : `Rating: ${item.rating}`}
                    </span>
                    <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="flex flex-col gap-2 p-2">
                    <h2 className="text-red-600 p-2.5 border rounded-lg bg-red-50/50 text-sm">
                      <strong>Rating: </strong>
                      {item.rating}
                    </h2>

                    <h2
                      className={`p-2.5 border rounded-lg text-sm ${
                        isUnattempted
                          ? "bg-amber-50 text-amber-900 border-amber-200 italic font-medium"
                          : "bg-red-50 text-red-900 border-red-200"
                      }`}
                    >
                      <strong>Your Answer: </strong>
                      {item.userAnswer}
                    </h2>

                    <h2 className="p-2.5 border rounded-lg bg-green-50 text-sm text-green-900 border-green-200">
                      <strong>Correct Answer: </strong>
                      {item.correctAns}
                    </h2>

                    <h2 className="p-2.5 border rounded-lg bg-blue-50 text-sm text-blue-900 border-blue-200">
                      <strong>Feedback: </strong>
                      {item.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </>
      )}

      <div className="mt-8">
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => router.replace("/dashboard")}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
