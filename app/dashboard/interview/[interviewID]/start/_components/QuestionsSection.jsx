"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionsSection({ mockInterviewQuestion, activeQuestionInd, setActiveQuestionInd }) {
  const currentQuestionText =
    mockInterviewQuestion?.[activeQuestionInd]?.question ||
    mockInterviewQuestion?.[activeQuestionInd]?.Question ||
    "";

  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech");
    }
  };

  return (
    mockInterviewQuestion && (
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockInterviewQuestion?.map((question, index) => (
            <h2
              key={index}
              onClick={() => setActiveQuestionInd && setActiveQuestionInd(index)}
              className={`p-2.5 text-xs md:text-sm text-center cursor-pointer rounded-lg transition-all ${
                activeQuestionInd === index
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Question {index + 1}
            </h2>
          ))}
        </div>

        <h2 className="my-6 text-base md:text-lg font-medium text-gray-900 leading-relaxed">
          {currentQuestionText}
        </h2>

        <div className="flex items-center gap-2">
          <Volume2
            className="cursor-pointer text-blue-600 hover:scale-110 transition-transform w-5 h-5"
            onClick={() => textToSpeech(currentQuestionText)}
            title="Listen to question"
          />
          <span className="text-xs text-gray-400">Click to listen</span>
        </div>

        <div className="border rounded-xl p-5 bg-blue-50 border-blue-200 mt-12">
          <h2 className="flex gap-2 items-center text-blue-800 font-semibold text-sm">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-xs md:text-sm text-blue-900 mt-2 leading-relaxed">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE ||
              "Click on 'Record Answer' when you want to answer. You can also edit your answer, save it, or skip to the next question."}
          </h2>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
