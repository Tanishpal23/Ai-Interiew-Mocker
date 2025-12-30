"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from "lucide-react";

function RecordAnswerSection() {

  const [userAnswer, setUserAnswer] = useState('');

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(()=>{
    results.map((result)=>{
      setUserAnswer(prevAns=>prevAns+result?.transcript)
    })
  }, [results])

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

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
      <Button variant="outline" className="my-10 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white " onClick={isRecording? stopSpeechToText: startSpeechToText}>
        {isRecording?
        
        <h2 className="text-red-600 flex gap-2">
          <Mic />Stop Recording....
        </h2>
        :
        'Record Answer'}
      </Button>

      <Button onClick={()=>console.log(userAnswer)}>
        Show Answer
      </Button>

          
    </div>
  ); 
}

export default RecordAnswerSection;
