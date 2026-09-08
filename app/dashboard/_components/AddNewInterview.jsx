"use client";
import React, { useState, onChange } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import generateAIResponseStream from "../../../utils/GeminiAIModal.js";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db.js";
import { MockInterview } from "@/utils/schema.js";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation.js";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDescription, setJobDescription] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [difficulty, setDifficulty] = useState("Mid-Level");
  const [interviewFocus, setInterviewFocus] = useState("Technical & Coding");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(jobPosition, jobExperience, jobDescription, difficulty, interviewFocus);

    try {
      const InputPrompt = `Job Position: ${jobPosition}, Job Description/Tech Stack/Resume: ${jobDescription}, Years of Experience: ${jobExperience}, Difficulty Level: ${difficulty}, Interview Focus: ${interviewFocus}, Depending on this information generate 5 interview question and answer in JSON format, Give question and answer as field in JSON.`
      // const InputPrompt = `Generate 5 interview questions and answers, like question 1 is "count from 1 to 5", question 2 is "count from 6 to 10", question 3 is "count from 11 to 15", question 4 is "count from 16 to 20", question 5 is "count from 21 to 25" in JSON format. Give question and answer as field in JSON`
      // const InputPrompt = `Write 1 to 5 number. Give answer as field in JSON`;

      console.log('Sending request to Gemini API...');
      const result = await generateAIResponseStream(InputPrompt);
      console.log('Raw Gemini Result:', result);

      let mockJSONResponse = result.replace(/```json/gi, "").replace(/```/g, "").trim();
      
      const firstBracket = mockJSONResponse.indexOf('[');
      const lastBracket = mockJSONResponse.lastIndexOf(']');
      const firstCurly = mockJSONResponse.indexOf('{');
      const lastCurly = mockJSONResponse.lastIndexOf('}');

      if (firstBracket !== -1 && lastBracket !== -1 && firstBracket < lastBracket) {
        mockJSONResponse = mockJSONResponse.substring(firstBracket, lastBracket + 1);
      } else if (firstCurly !== -1 && lastCurly !== -1 && firstCurly < lastCurly) {
        // If it responds with an object instead of an array
        mockJSONResponse = mockJSONResponse.substring(firstCurly, lastCurly + 1);
      }

      console.log('JSON String to parse:', mockJSONResponse);
      const parsed = JSON.parse(mockJSONResponse); 
      console.log('Successfully Parsed JSON:', parsed);
      
      setJsonResponse(mockJSONResponse);

      if (mockJSONResponse) {
        const resp = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: mockJSONResponse,
            jobPosition: jobPosition || 'N/A',
            jobDesc: jobDescription || 'N/A',
            jobExperience: jobExperience || '0',
            createdBy: user?.primaryEmailAddress?.emailAddress || 'anonymous',
            createdAt: moment().format("DD-MM-YYYY"),
          })
          .returning({ mockId: MockInterview.mockId });

        console.log("Inserted ID:", resp[0]?.mockId);
        if (resp) {
          setOpenDialog(false);
          router.push('/dashboard/interview/' + resp[0]?.mockId);
        }
      }
    } catch (e) {
      console.error('CRITICAL ERROR inside onSubmit:', e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div
        className="p-10 rounded-lg bg-green-100 hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-center text-lg">+ Add New</h2>
      </div>

      <div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-xl bg-white shadow-lg">

            <DialogHeader>
              <DialogTitle className="font-bold text-2xl">
                Tell us more about your job interview
              </DialogTitle>
              <form onSubmit={onSubmit}>
                <div>
                  <h2 className="text-sm text-gray-500">
                    Add details about the job position, description or candidate resume, difficulty, and interview focus.
                  </h2>
                  <div className="mt-5 my-3">
                    <label className="text-sm font-medium text-gray-700">Job Role / Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer, DevOps Engineer"
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label className="text-sm font-medium text-gray-700">Job Description or Paste Resume</label>
                    <Textarea
                      placeholder="Paste job requirements, tech stack (React, Node, SQL), or paste your candidate resume here..."
                      className="min-h-[85px]"
                      required
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Experience (Yrs)</label>
                      <Input
                        placeholder="Ex. 3"
                        type="number"
                        min="0"
                        max="50"
                        required
                        onChange={(e) => setJobExperience(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Difficulty</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                      >
                        <option value="Junior / Entry-Level">Junior / Entry-Level</option>
                        <option value="Mid-Level">Mid-Level</option>
                        <option value="Senior / Lead">Senior / Lead</option>
                        <option value="Staff / Architect">Staff / Architect</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Focus Area</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={interviewFocus}
                        onChange={(e) => setInterviewFocus(e.target.value)}
                      >
                        <option value="Technical & Coding">Technical & Coding</option>
                        <option value="System Design & Architecture">System Design</option>
                        <option value="Behavioral (STAR Method)">Behavioral (STAR)</option>
                        <option value="Comprehensive / Mixed">Comprehensive (Mixed)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-5 justify-end mt-5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                        Generating Questions...
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default AddNewInterview;
