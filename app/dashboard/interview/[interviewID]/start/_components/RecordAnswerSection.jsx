"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import generateAIResponseStream from "../../../../../../utils/GeminiAIModal.js";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import moment from "moment/moment.js";


function RecordAnswerSection({mockInterviewQuestion, activeQuestionInd, interviewData}) {

  const [userAnswer, setUserAnswer] = useState('');
  const {user} = useUser();
  const [loading, setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(()=>{
    results.map((result)=>{
      setUserAnswer(prevAns=>prevAns+result?.transcript)
    })
  }, [results])

  useEffect(()=>{
    if(!isRecording&&userAnswer.length>10){
      UpdateUserAnswer();
    }
    
  },[userAnswer])

  const StartStopRecording=async()=>{
    if(isRecording){

      stopSpeechToText();

    }else{
      startSpeechToText()
    }
  }
  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  const UpdateUserAnswer=async()=>{
      console.log('hllo world');
      console.log(mockInterviewQuestion[activeQuestionInd]?.question);
      setLoading(true);
      const feedbackPrompt = "Question:"+mockInterviewQuestion[activeQuestionInd]?.question+",User Answer"+userAnswer+",Depends on question and user answer for given interview question "+
      "please give us rating and feedback as area of improvement if any "+"in just 3-5 lines in JSON format with rating field and feedback field. Give your response as JSON format only";

      const result = await generateAIResponseStream(feedbackPrompt);

      const mockJSONResponse = result.replace("```json", "").replace("```", "");
      console.log(mockJSONResponse);

      const JsonFeedbackResp = JSON.parse(mockJSONResponse);

      const resp = await db.insert(UserAnswer)
      .values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionInd]?.question,
        correctAns: mockInterviewQuestion[activeQuestionInd]?.answer,
        userAnswer: userAnswer,
        feedback: JsonFeedbackResp,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY'),
      })

      if(resp){
        toast('user answer recorded sucessfully');
        setUserAnswer('');
        setResults([]);
      }
      setResults([]);
      console.log(userAnswer);
      setLoading(false);
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col my-20 justify-center items-center rounded-lg p-5">
        <Image
          alt="webcam placeholder"
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute"
        ></Image>
        <Webcam
          mirrored={true}
          style={{
            height: 200,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button 
      disabled={loading}
      variant="outline" className="my-10 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white " onClick={StartStopRecording}>
        {isRecording?
        
        <h2 className="text-red-600 flex gap-2">
          <StopCircle />Stop Recording....
        </h2>
        :
        'Record Answer'}
      </Button>

      

          
    </div>
  ); 
}

export default RecordAnswerSection;
