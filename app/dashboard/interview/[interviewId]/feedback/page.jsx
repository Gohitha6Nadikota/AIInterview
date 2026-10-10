"use client";

import React, { useEffect, useState } from "react";
import { getFeedback } from "@/utils/actions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsDownUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Feedback = ({ params }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadFeedback();
  }, [params.interviewId]);

  const loadFeedback = async () => {
    try {
      setFeedbackList(await getFeedback(params.interviewId));
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (feedbackList.length === 0) return 0;
    const ratings = feedbackList.map((item) => Number.parseFloat(item.rating)).filter(Number.isFinite);
    if (!ratings.length) return "0.0";
    return (ratings.reduce((total, rating) => total + rating, 0) / ratings.length).toFixed(1);
  };

  return (
    <div className="p-10">
      <div className="bg-white text-black p-5 rounded-lg">
        {loading ? (
          <h2 className="text-center my-5">Loading feedback...</h2>
        ) : feedbackList.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-green-500">
              Congratulations
            </h2>
            <h2 className="font-bold text-xl mt-3">
              Here is your Interview Feedback
            </h2>
            <h2 className="text-blue-600 text-lg my-3 p-2">
              ⭐Your overall interview rating:{" "}
              <strong>{calculateAverageRating()}/10</strong>
            </h2>
            <h2 className="text-xl text-gray-500 mb-2">
              Find below the feedback and areas of improvement for all questions
            </h2>
            {feedbackList.map((item) => (
              <Collapsible key={item.id}>
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
        type="button"
        onClick={() => router.replace("/dashboard")}
        className="bg-[#0D92F4] text-lg mt-5"
      >
        Go to Home
      </Button>
    </div>
  );
};

export default Feedback;
