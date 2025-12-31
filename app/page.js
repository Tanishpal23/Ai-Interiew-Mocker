
"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      {/* Logo */}
      <div className="mb-8">
        <Image src="/logo.svg" width={100} height={100} alt="Logo" />
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        Welcome to Mock Mate
      </h1>

      <p className="text-gray-600 text-center mb-8 max-w-md">
        Practice mock interviews, get feedback, and improve your skills
        all in one place.
      </p>

      {/* Button */}
      <Button
        onClick={goToDashboard}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition-all cursor-pointer"
      >
        Go to Dashboard
      </Button>
    </div>
  );
}
