"use client";
import React, { useEffect, useState } from "react";
import { getInterview, hasAnswers } from "@/utils/actions";
import QuestionSection from "./_components/QuestionSection";
import RecordSection from "./_components/RecordSection";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [active, setActive] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    GetInterviewDetails();
  }, [params.interviewId]);

  const GetInterviewDetails = async () => {
    try {
      const interview = await getInterview(params.interviewId);
      if (!interview) {
        setNotFound(true);
        return;
      }
      setInterviewData(interview);
    } catch (error) {
      console.error("Error fetching interview data:", error);
      toast.error("Failed to load the interview. Please refresh the page.", { duration: 3000 });
    }
  };

  const handleEndInterview = async () => {
    setIsEnding(true);
    try {
      if (await hasAnswers(interviewData.mockId)) {
        router.push(`/dashboard/interview/${interviewData.mockId}/feedback`);
      } else {
        toast.warning("Record at least one answer before ending the interview.", { duration: 3000 });
        setIsEnding(false);
      }
    } catch (error) {
      console.error("Error ending interview:", error);
      toast.error("Could not end the interview. Please try again.", { duration: 3000 });
      setIsEnding(false);
    }
  };

  if (notFound) {
    return <p className="p-10">Interview not found.</p>;
  }

  const questions = interviewData?.questions ?? [];
  const navDisabled = isBusy || isEnding;

  return (
    <div className="h-[91vh]">
      {interviewData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <QuestionSection
              questions={questions}
              active={active}
              onSelect={setActive}
              disabled={navDisabled}
            />
            <RecordSection
              questions={questions}
              active={active}
              mockId={interviewData.mockId}
              onBusyChange={setIsBusy}
            />
          </div>
          <div className="flex justify-end gap-6">
            {active > 0 && (
              <Button disabled={navDisabled} onClick={() => setActive(active - 1)}>
                Previous
              </Button>
            )}
            {active !== questions.length - 1 ? (
              <Button disabled={navDisabled} onClick={() => setActive(active + 1)}>
                Next
              </Button>
            ) : (
              <Button disabled={navDisabled} onClick={handleEndInterview}>
                {isEnding ? "Ending..." : "End Interview"}
              </Button>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StartInterview;
