"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const resolvedParams = React.use(params);
  const interviewID = resolvedParams?.interviewID ?? null;

  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    if (!interviewID) return;
    console.log(interviewID);
    getInterviewDetails();
  }, [interviewID]);

  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewID));

    setInterviewData(result[0]);
    console.log(result);
  };
  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 my-20 gap-10">

        <div className="flex flex-col gap-5">

          <div className="flex flex-col p-5 rounded-lg border gap-5">
            <h2 className="text-lg">
              <strong>Job Position: </strong>
              {interviewData?.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Tech stack: </strong>
              {interviewData?.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Job Experience: </strong>
              {interviewData?.jobExperience}
            </h2>
          </div>

          <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
            <h2 className="flex gap-2 items-center text-yellow-500"><Lightbulb /><strong>Information</strong></h2>
            <h2 className="mt-3 text-yellow-800">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full p-20 bg-gray-100 rounded-lg border" />
              <Button variant="ghost"
                className="border-2 border-black bg-white text-black hover:bg-blue-100"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Web Cam And Microphone
              </Button>
            </>
          )}
        </div>
        
      </div>

      <div className="flex justify-end items-end">
        <Button className="border-2 border-black bg-white text-black hover:bg-blue-100">Start Interview</Button>
      </div>
      
    </div>
  );
}

export default Interview;
