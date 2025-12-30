"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionsSection({ mockInterviewQuestion, activeQuestionInd }) {

  const textToSpeech=(text)=>{
    if('speechSynthesis' in window){
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    }else{
      alert('Sorry your browser does not support text to speech')
    }
  }
  return mockInterviewQuestion&&(
    <div  className="p-5">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion?.map((question, index) => (
          <h2
            key={index}
            className={`p-2 text-xs md:text-sm text-center cursor-pointer rounded 
              ${activeQuestionInd === index 
                ? "bg-blue-600 text-white font-semibold" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Question {index + 1}
          </h2>
        ))}
        
      </div>
      <h2 className="my-5 text-md md_text-lg">{mockInterviewQuestion[activeQuestionInd]?.question}</h2>
      
      <Volume2 onClick={()=>textToSpeech(mockInterviewQuestion[activeQuestionInd]?.question)}/>

      <div className="border rounded-lg p-5 bg-blue-100 mt-20">
        <h2 className="flex gap-2 items-center text-primary">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className="text-sm text-primary my-2">{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
      </div>

    </div>
  );
}

export default QuestionsSection;
