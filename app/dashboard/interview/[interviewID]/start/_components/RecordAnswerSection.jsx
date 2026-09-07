"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle, LoaderCircle, CheckCircle2, Save, AlertCircle, SkipForward } from "lucide-react";
import { toast } from "sonner";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionInd,
  interviewData,
  userAnswer,
  setUserAnswer,
  loading,
  isSaved,
  setIsSaved,
  saveAnswer,
  handleNext,
}) {
  const isStoppingRef = useRef(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Safely accumulate speech transcripts without repeating previous chunks
  useEffect(() => {
    if (results && results.length > 0) {
      const fullTranscript = results
        .map((r) => (typeof r === "string" ? r : r?.transcript || ""))
        .filter(Boolean)
        .join(" ");

      if (fullTranscript) {
        setUserAnswer(fullTranscript);
        if (setIsSaved) setIsSaved(false);
      }
    }
  }, [results, setUserAnswer, setIsSaved]);

  // When recording stops, auto-save if an answer was detected
  useEffect(() => {
    if (!isRecording && isStoppingRef.current) {
      isStoppingRef.current = false;
      const timer = setTimeout(() => {
        if (userAnswer?.trim()?.length) {
          saveAnswer(userAnswer);
        } else {
          toast.info("Recording stopped. No speech detected.");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isRecording, userAnswer, saveAnswer]);

  const StartStopRecording = () => {
    if (isRecording) {
      isStoppingRef.current = true;
      stopSpeechToText();
    } else {
      if (setIsSaved) setIsSaved(false);
      setUserAnswer("");
      setResults([]);
      isStoppingRef.current = false;
      startSpeechToText();
    }
  };

  const handleSkip = () => {
    if (isRecording) {
      isStoppingRef.current = false;
      stopSpeechToText();
    }
    handleNext();
  };

  return (
    <div className="flex items-center justify-center flex-col w-full max-w-xl mx-auto">
      {/* Webcam Section */}
      <div className="flex flex-col my-5 justify-center items-center rounded-xl p-5 bg-black/5 relative w-full h-[260px] overflow-hidden border">
        <Image
          alt="webcam placeholder"
          src={"/webcam.png"}
          width={180}
          height={180}
          className="absolute opacity-40"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 250,
            width: "100%",
            zIndex: 10,
            borderRadius: "0.75rem",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Recording Status & Error Notices */}
      {error && (
        <div className="flex items-center gap-2 p-3 my-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg w-full">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            Speech recognition notice ({String(error)}). You can type your answer in the box below, or click Next to skip!
          </span>
        </div>
      )}

      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-red-600 font-medium my-2 animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          Recording in progress... Speak clearly into your microphone.
        </div>
      )}

      {/* Actions: Record, Save, Skip */}
      <div className="flex flex-wrap gap-3 my-4 items-center justify-center">
        <Button
          disabled={loading}
          variant="outline"
          className={`border-blue-600 transition-all ${
            isRecording
              ? "text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
              : "text-blue-600 hover:bg-blue-600 hover:text-white"
          }`}
          onClick={StartStopRecording}
        >
          {isRecording ? (
            <span className="flex items-center gap-2">
              <StopCircle className="w-5 h-5 animate-pulse" /> Stop Recording...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mic className="w-5 h-5" /> Record Answer
            </span>
          )}
        </Button>

        <Button
          disabled={loading || isRecording || !userAnswer?.trim()}
          className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          onClick={() => saveAnswer(userAnswer)}
        >
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Answer
            </>
          )}
        </Button>

        <Button
          type="button"
          disabled={loading}
          variant="ghost"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center gap-1.5"
          onClick={handleSkip}
        >
          <SkipForward className="w-4 h-4" /> Skip
        </Button>
      </div>

      {/* Answer Transcript & Live Preview */}
      <div className="w-full mt-2">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Your Answer (Live Transcript / Editable):
          </label>
          {isSaved && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved in DB
            </span>
          )}
        </div>
        <textarea
          rows={4}
          value={userAnswer}
          onChange={(e) => {
            setUserAnswer(e.target.value);
            if (setIsSaved) setIsSaved(false);
          }}
          placeholder={
            isRecording
              ? "Listening... your words will appear here in real time."
              : "Click 'Record Answer' to speak, type your answer, or click Next/Skip to proceed."
          }
          className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm resize-none"
        />
        {interimResult && (
          <p className="text-xs text-gray-400 italic mt-1">
            Listening: {interimResult}
          </p>
        )}
      </div>
    </div>
  );
}

export default RecordAnswerSection;
