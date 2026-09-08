"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Mic,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Timer,
  Award,
  FileText,
  Volume2,
  Video,
  Layers,
  ChevronRight,
  Github,
  Zap,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-slate-50/50 to-gray-100 text-gray-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <Image src="/logo.svg" width={34} height={34} alt="Mock Mate Logo" priority />
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Mock Mate
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-blue-600 transition-colors">
              Simulation
            </a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              How It Works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all text-sm px-4 py-2 rounded-lg"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-400/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-purple-400/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Practice real interviews powered by Gemini AI</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15] mb-6">
            Master Your Next Tech Interview with{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Precision
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience realistic voice-enabled mock interviews tailored to your exact role, resume, and experience. Get real-time speech recognition, countdown pressure, and instant actionable feedback.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-7 py-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
            >
              Start Free Mock Interview
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <a
              href="#preview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-base shadow-xs transition-colors"
            >
              See Interactive Preview
            </a>
          </div>

          {/* Key Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Speech-to-Text Voice Input</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>15-Min Timer Pressure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Exportable PDF Reports</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mock Interview Preview Section */}
      <section id="preview" className="py-12 md:py-16 bg-white border-y border-gray-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              Live Simulation Preview
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              Designed to simulate the real interview pressure
            </p>
          </div>

          {/* Mock Browser / App Window */}
          <div className="rounded-2xl border border-gray-200 shadow-xl bg-slate-900 overflow-hidden text-gray-100">
            {/* Window Top Bar */}
            <div className="bg-slate-800/90 px-4 py-3 flex items-center justify-between border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
                <span className="text-xs text-slate-400 font-mono ml-2 hidden sm:inline">
                  mockmate.ai/interview/start
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-700/80 px-3 py-1 rounded-full text-xs text-amber-300 font-mono">
                <Timer className="w-3.5 h-3.5" />
                <span>12:45 remaining</span>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950">
              {/* Left: Question Box */}
              <div className="flex flex-col justify-between p-5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-950 text-blue-400 border border-blue-800">
                      Question #1 • Technical & Architecture
                    </span>
                    <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-blue-400" /> Read Aloud
                    </button>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-100 leading-snug">
                    "How does React's Virtual DOM diffing algorithm optimize DOM updates, and why are keys critical during list rendering?"
                  </h3>
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                    💡 Tip: Explain tree comparison heuristics, batching, and how keys prevent unnecessary unmounting.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Role: Full Stack Engineer</span>
                  <span className="text-emerald-400 font-medium">Difficulty: Mid-Senior</span>
                </div>
              </div>

              {/* Right: Camera & Speech-to-Text Simulation */}
              <div className="flex flex-col justify-between p-5 rounded-xl bg-slate-900/90 border border-slate-800">
                {/* Simulated Webcam */}
                <div className="relative h-44 rounded-lg bg-slate-800 flex flex-col items-center justify-center border border-slate-700/70 overflow-hidden">
                  <div className="w-16 h-16 rounded-full bg-slate-700/60 flex items-center justify-center mb-2">
                    <Video className="w-8 h-8 text-slate-400" />
                  </div>
                  <span className="text-xs text-slate-400">Webcam Feed Active</span>
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-400 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE REC
                  </div>
                </div>

                {/* Simulated Live Transcript */}
                <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-medium mb-1">
                    <Mic className="w-3.5 h-3.5 animate-pulse text-rose-400" />
                    <span>Candidate Live Speech:</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    "React compares Virtual DOM nodes using an O(n) heuristic algorithm. Keys give elements a persistent identity across renders..."
                  </p>
                </div>
              </div>
            </div>

            {/* Window Bottom Bar: Feedback Teaser */}
            <div className="bg-slate-900 px-6 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>AI Evaluation Score: <strong className="text-emerald-400">8.5 / 10</strong></span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Detailed model answer comparison ready</span>
              </div>
              <span className="text-blue-400 font-medium">Downloadable PDF Summary Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
            Engineered for High-Stakes Success
          </h2>
          <p className="text-3xl font-extrabold text-gray-900">
            Everything you need to interview with confidence
          </p>
          <p className="text-gray-600 text-sm sm:text-base mt-3">
            Simulate every facet of real technical rounds with intelligent AI grading and targeted practice.
          </p>
        </div>

        {/* 3 Main Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Speech-to-Text */}
          <div className="p-7 bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Speech-to-Text Voice Practice
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Speak your answers out loud naturally using browser-based speech recognition. Practicing speaking under pressure trains clarity and conciseness.
            </p>
            <ul className="text-xs text-gray-500 space-y-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Real-time speech transcription
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Audio readout (TTS) for questions
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Manual text answer fallback
              </li>
            </ul>
          </div>

          {/* Card 2: Instant AI Scoring */}
          <div className="p-7 bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Instant AI Scoring & Feedback
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Get immediate, granular scoring out of 10 for every question. View ideal model answers side-by-side with specific improvement pointers.
            </p>
            <ul className="text-xs text-gray-500 space-y-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Granular ratings & feedback
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Model answers for comparison
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Instant PDF report export
              </li>
            </ul>
          </div>

          {/* Card 3: Smart Question Bank & Resume Tailoring */}
          <div className="p-7 bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Smart Customization & Resume
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Tailor question difficulty from Junior to Staff. Focus on System Design, Coding, or STAR Behavioral rounds, or paste your resume for targeted prep.
            </p>
            <ul className="text-xs text-gray-500 space-y-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Job description & resume parsing
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Junior, Mid, Senior, Staff tiers
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Custom question AI practice hub
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-slate-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              Simple 3-Step Process
            </h2>
            <p className="text-3xl font-extrabold text-gray-900">
              How Mock Mate Prepares You
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-xs">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">
                1
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Set Your Target Role</h3>
              <p className="text-xs text-gray-600">
                Choose your job title, experience level, interview focus, or paste job requirements/resume.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-xs">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">
                2
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Simulate Real Interview</h3>
              <p className="text-xs text-gray-600">
                Answer 5 questions under the 15-minute countdown clock using your voice and webcam preview.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-xs">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">
                3
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Review & Download PDF</h3>
              <p className="text-xs text-gray-600">
                Compare your responses against model answers, check your score, and download study notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
            Ready to Ace Your Next Tech Interview?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Start practicing with Gemini AI today. No credit card required.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-blue-700 hover:bg-gray-100 font-bold text-base px-8 py-6 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Launch Your First Mock Interview
          </Button>
        </div>
      </section>
    </div>
  );
}
