"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const InterviewItemCard = ({ interview, refreshData }) => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const onStart = () => {
    router.push("/dashboard/interview/" + interview?.mockId);
  };

  const onFeedbackPress = () => {
    router.push("/dashboard/interview/" + interview?.mockId + "/feedback");
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      // 1. Delete all user answers associated with this interview
      await db
        .delete(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interview?.mockId));

      // 2. Delete the mock interview itself
      await db
        .delete(MockInterview)
        .where(eq(MockInterview.mockId, interview?.mockId));

      toast.success("Interview deleted successfully!");
      setOpenDialog(false);
      if (refreshData) {
        refreshData();
      }
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border shadow-sm rounded-lg p-4 bg-white hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h2 className="font-bold text-primary text-base">
            {interview?.jobPosition}
          </h2>
          <h2 className="text-sm text-gray-600">
            Experience: {interview?.jobExperience} yrs
          </h2>
          <h2 className="text-xs text-gray-400 mt-1">
            CreatedAt: {interview?.createdAt}
          </h2>
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => setOpenDialog(true)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Delete Interview"
          aria-label="Delete interview"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex mt-4 gap-3 w-full">
        <Button
          size="sm"
          variant="outline"
          onClick={onFeedbackPress}
          className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          Feedback
        </Button>

        <Button
          size="sm"
          onClick={onStart}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Start
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
              <Trash2 className="h-5 w-5 text-red-600" />
              Delete Interview?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete the interview for{" "}
              <strong className="text-gray-900 font-semibold">
                "{interview?.jobPosition}"
              </strong>
              ? This action cannot be undone and will permanently delete all associated answers and feedback.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
              onClick={handleDelete}
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" /> Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterviewItemCard;