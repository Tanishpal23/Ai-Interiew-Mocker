"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";

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
        <QuestionsSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionInd={activeQuestionInd}
         />

        <RecordAnswerSection />
      </div>
    </div>
  );
};

export default StartInterview;
