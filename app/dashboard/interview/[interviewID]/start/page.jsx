"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StartInterview = ({ params }) => {
  const resolvedParams = React.use(params);
  const interviewID = resolvedParams?.interviewID ?? null;

  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionInd, setActiveQuestionInd] = useState(0);

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

    const jsonMockResp = JSON.parse(result[0].jsonMockResp);

    console.log(jsonMockResp);
    setMockInterviewQuestion(jsonMockResp);
    setInterviewData(result[0]);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* {Questions} */}
        {/* {console.log(mockInterviewQuestion)} */}
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionInd={activeQuestionInd}
        />

        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionInd={activeQuestionInd}
          interviewData={interviewData}
        />
      </div>

      <div className="flex justify-end gap-6 mt-8">
        {activeQuestionInd > 0 && (
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setActiveQuestionInd(activeQuestionInd - 1)}
          >
            Previous
          </Button>
        )}

        {activeQuestionInd !== mockInterviewQuestion?.length - 1 && (
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setActiveQuestionInd(activeQuestionInd + 1)}
          >
            Next
          </Button>
        )}

        {activeQuestionInd === mockInterviewQuestion?.length - 1 && (
          <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
          <Button className="bg-red-600 text-white hover:bg-red-700">
            End Interview
          </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
