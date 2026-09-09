"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Download, Printer, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getFeedbackReportAction } from "@/actions/answer";

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [interviewInfo, setInterviewInfo] = useState(null);
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    try {
      const res = await getFeedbackReportAction(params.interviewID);
      setFeedbackList(res?.feedbackList || []);
      setInterviewInfo(res?.interviewInfo || null);
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
        const match = String(item.rating).match(/([0-9]+(?:\.[0-9]+)?)/);
        if (match) {
          totalScore += parseFloat(match[1]);
        }
      }
    });

    const avg = totalScore / feedbackList.length;
    return avg % 1 === 0 ? avg.toFixed(0) : avg.toFixed(1);
  }, [feedbackList]);

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto print:p-2 print:max-w-full">
      {/* Top Action Bar (hidden in print) */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button
          variant="outline"
          className="gap-2 text-gray-700"
          onClick={() => router.replace("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>

        {feedbackList?.length > 0 && (
          <Button
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" /> Download Report (PDF)
          </Button>
        )}
      </div>

      {feedbackList?.length === 0 ? (
        <h2 className="font-bold text-xl text-gray-500">
          No Interview Feedback Record Found.
        </h2>
      ) : (
        <>
          {/* Header Section */}
          <div className="border-b pb-5 mb-5">
            <h2 className="text-3xl font-bold text-green-600">
              Congratulations!
            </h2>

            <h2 className="font-bold text-2xl mt-1 text-gray-900">
              Interview Evaluation Report
            </h2>

            {/* Candidate & Role Metadata */}
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 mt-2">
              {interviewInfo?.jobPosition && (
                <p>
                  <strong>Role:</strong> {interviewInfo.jobPosition}
                </p>
              )}
              {interviewInfo?.jobExperience && (
                <p>
                  <strong>Experience:</strong> {interviewInfo.jobExperience} yrs
                </p>
              )}
              {interviewInfo?.createdAt && (
                <p>
                  <strong>Date:</strong> {interviewInfo.createdAt}
                </p>
              )}
              {user?.fullName && (
                <p>
                  <strong>Candidate:</strong> {user.fullName}
                </p>
              )}
            </div>

            {/* Overall Rating Display */}
            <div className="mt-4 p-4 rounded-xl bg-blue-50/80 border border-blue-200 inline-block print:border-gray-300">
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-950 block">
                Overall Performance Rating
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-3xl font-extrabold ${
                    Number(overallRating) >= 7
                      ? "text-green-600"
                      : Number(overallRating) >= 4
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {overallRating}
                </span>
                <span className="text-gray-500 font-medium text-lg">/ 10</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-3 print:hidden">
              Find below each interview question with your answer, the ideal model answer, and personalized feedback for improvement:
            </p>
          </div>

          {/* Question Breakdown List */}
          <div className="space-y-4">
            {feedbackList.map((item, index) => {
              const isUnattempted = item.userAnswer === "answer unattempted";

              return (
                <Collapsible
                  key={index}
                  defaultOpen={true}
                  className="border rounded-xl bg-white shadow-xs overflow-hidden print:border-gray-300 print:shadow-none"
                >
                  <CollapsibleTrigger className="w-full p-4 bg-gray-50/80 flex justify-between items-center text-left gap-4 hover:bg-gray-100 transition-colors cursor-pointer print:bg-gray-100">
                    <span className="font-semibold text-gray-900 text-sm md:text-base">
                      Question {index + 1}: {item.question}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          isUnattempted
                            ? "bg-amber-100 text-amber-800"
                            : Number(String(item.rating).match(/\d+/)?.[0] || 0) >= 7
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isUnattempted ? "Unattempted" : `Rating: ${item.rating}`}
                      </span>
                      <ChevronsUpDown className="h-4 w-4 text-gray-400 print:hidden" />
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="print:block">
                    <div className="p-4 flex flex-col gap-2.5 bg-white border-t border-gray-100">
                      <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 w-fit">
                        Score: {item.rating || "0"}
                      </div>

                      <div
                        className={`p-3 rounded-lg text-sm border ${
                          isUnattempted
                            ? "bg-amber-50/60 text-amber-900 border-amber-200 italic font-medium"
                            : "bg-red-50/50 text-red-900 border-red-200"
                        }`}
                      >
                        <strong className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                          Your Answer:
                        </strong>
                        {item.userAnswer}
                      </div>

                      <div className="p-3 rounded-lg bg-green-50/50 text-sm text-green-950 border border-green-200">
                        <strong className="block text-xs uppercase tracking-wider text-green-700 mb-1">
                          Correct / Model Answer:
                        </strong>
                        {item.correctAns}
                      </div>

                      <div className="p-3 rounded-lg bg-blue-50/50 text-sm text-blue-950 border border-blue-200">
                        <strong className="block text-xs uppercase tracking-wider text-blue-700 mb-1">
                          AI Feedback & Areas of Improvement:
                        </strong>
                        {item.feedback}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>

          {/* Bottom Action Footer (hidden in print) */}
          <div className="mt-8 flex gap-4 print:hidden">
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700 gap-2"
              onClick={() => router.replace("/dashboard")}
            >
              <Home className="w-4 h-4" /> Go to Dashboard
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-gray-300"
              onClick={handleDownloadPDF}
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </Button>
          </div>
        </>
      )}

      {/* Print CSS overrides */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, footer, nav {
            display: none !important;
          }
          /* Ensure all collapsibles remain open in print preview */
          [data-state="closed"] {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Feedback;
