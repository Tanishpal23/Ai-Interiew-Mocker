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

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobExperience, jobDescription);

    const InputPrompt = `Job Position: ${jobPosition}, Job Description/Tech Stack: ${jobDescription}, Years of Experience: ${jobExperience}, Depending on this information generate 5 interview question and answer in JSON format, Give question and answer as field in JSON.`

    // const InputPrompt = `Write 1 to 5 number. Give answer as field in JSON`;

    const result = await generateAIResponseStream(InputPrompt);
    const mockJSONResponse = result.replace("```json", "").replace("```", "");
    // console.log(mockJSONResponse);
    console.log(JSON.parse(mockJSONResponse));
    setJsonResponse(mockJSONResponse);

    if (mockJSONResponse) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: mockJSONResponse,
          jobPosition: jobPosition,
          jobDesc: jobDescription,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("Inserted ID:", resp[0].mockId);
      if(resp){
        setOpenDialog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockId)
      }
    } else {
      console.log("Error");
    }
    setLoading(false);
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
          <DialogContent className={"max-w-xl"}>
            <DialogHeader>
              <DialogTitle className="font-bold text-2xl">
                Tell us more about your job interview
              </DialogTitle>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add Details about job position/role, Job description and
                    years of experience
                  </h2>
                  <div className="mt-7 my-3">
                    <label>Job Role/Position</label>
                    <Input
                      placeholder="Ex. Full stack Developer"
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label>Job Description/Tech Stack</label>
                    <Textarea
                      placeholder="Ex. React, Angular, NodeJS, mySQL etc"
                      required
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label>Years of Experience</label>
                    <Input
                      placeholder="Ex. 5"
                      type="number"
                      min="0"
                      max="50"
                      required
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end mt-4">
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
                        <LoaderCircle className="animate-spin" />
                        'Generating From AI'
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
