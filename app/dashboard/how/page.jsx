import { FileText, Bot, Mic, BarChart2, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: <FileText className="h-6 w-6 text-blue-600" />,
    title: "Enter Your Details",
    desc: "Provide your job role, tech stack, and years of experience.",
  },
  {
    icon: <Bot className="h-6 w-6 text-blue-600" />,
    title: "AI Generates Questions",
    desc: "Gemini AI creates 5 tailored interview questions based on your input.",
  },
  {
    icon: <Mic className="h-6 w-6 text-blue-600" />,
    title: "Answer with Your Mic",
    desc: "Speak your answers aloud. Your speech is captured via the microphone.",
  },
  {
    icon: <BarChart2 className="h-6 w-6 text-blue-600" />,
    title: "Get AI Feedback",
    desc: "Receive an instant rating and improvement tips for each answer.",
  },
  {
    icon: <RefreshCw className="h-6 w-6 text-blue-600" />,
    title: "Review & Improve",
    desc: "Compare your answers with correct answers and keep practising.",
  },
];

const page = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">How It Works</h1>
      <p className="text-gray-500 mt-1 mb-8">
        Get started with your AI mock interview in 5 simple steps.
      </p>

      <div className="flex flex-col gap-4 max-w-2xl">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start gap-4 border rounded-lg p-4"
          >
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 shrink-0">
              {step.icon}
            </div>
            <div>
              <h2 className="font-semibold">
                Step {index + 1}: {step.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;