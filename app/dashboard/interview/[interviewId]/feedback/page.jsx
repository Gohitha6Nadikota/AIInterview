"use client";

import { UserAnswer } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { eq } from "drizzle-orm";
import { ChevronsDownUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

const Feedback = ({ params }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    const res = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);
    setFeedbackList(res);
  };

  return (
    <div className="p-10">
      <div className="bg-white text-black p-5 rounded-lg">
        {feedbackList.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-green-500">
              Congratulations
            </h2>
            <h2 className="font-bold text-xl mt-3">
              Here is your Interview Feedback
            </h2>
            <h2 className="text-blue-600 text-lg my-3 p-2">
              ⭐Your overall interview rating: <strong>7/10</strong>
            </h2>
            <h2 className="text-xl text-gray-500 mb-2">
              Find below the feedback and areas of improvement for all questions
            </h2>
            {feedbackList.map((item, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger className="p-2 bg-secondary w-full rounded-lg my-2 gap-7 flex justify-between text-left">
                  {"🤔" + item.question}{" "}
                  <ChevronsDownUpIcon className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-red-500 p-2 border rounded-lg">
                      <strong>Rating:</strong> {item.rating}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                      <strong>Your Answer:</strong> {item.userAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                      <strong>Sample Correct Answer:</strong> {item.correctAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-blue-900">
                      <strong>Feedback:</strong> {item.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </>
        ) : (
          <h2 className="text-center my-5">No feedback found</h2>
        )}
      </div>

      <Button
        onClick={() => router.replace("/dashboard")}
        variant="contained"
        color="primary"
        className="mt-5"
      >
        Go to Home
      </Button>
    </div>
  );
};

export default Feedback;
