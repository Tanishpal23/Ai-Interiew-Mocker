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
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation.js";
import { toast } from "sonner";
import { createInterviewAction } from "@/actions/interview";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDescription, setJobDescription] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [difficulty, setDifficulty] = useState("Mid-Level");
  const [interviewFocus, setInterviewFocus] = useState("Technical & Coding");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createInterviewAction({
        jobPosition,
        jobDesc: jobDescription,
        jobExperience,
        difficulty,
        interviewFocus,
      });

      if (res?.success && res?.mockId) {
        setOpenDialog(false);
        router.push('/dashboard/interview/' + res.mockId);
      } else {
        toast.error(res?.error || "Failed to generate interview. Please try again.");
      }
    } catch (e) {
      console.error('CRITICAL ERROR inside onSubmit:', e);
      toast.error("Failed to generate interview. Please try again.");
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
