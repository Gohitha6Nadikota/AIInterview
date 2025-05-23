"use client";
import React, { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import QuestionSection from "./_components/QuestionSection";
import RecordSection from "./_components/RecordSection";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [mockData, setMockData] = useState(null);
  const [active, setActive] = useState(0);
  const router = useRouter();

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      const data = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));
      const resp = JSON.parse(data[0].jsonMockResp);
      setMockData(resp);
      setInterviewData(data[0]);
    } catch (error) {
      console.error("Error fetching interview data:", error);
    }
  };

  const handleEndInterview = async () => {
    let attempts = 0;
    let feedbackReady = false;

    while (attempts < 10 && !feedbackReady) {
      const res = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewData.mockId));

      if (res.length > 0) {
        feedbackReady = true;
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1s
      attempts++;
    }

    if (feedbackReady) {
      router.push(`/dashboard/interview/${interviewData.mockId}/feedback`);
    } else {
      alert("Feedback generation timed out. Try again later.");
    }
  };

  return (
    <div className="h-[91vh]">
      {interviewData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <QuestionSection mockData={mockData} active={active} />
            <RecordSection
              mockData={mockData}
              active={active}
              interviewData={interviewData}
            />
          </div>
          <div className="flex justify-end gap-6">
            {active > 0 && (
              <Button onClick={() => setActive(active - 1)}>Previous</Button>
            )}
            {active !== mockData.length - 1 ? (
              <Button onClick={() => setActive(active + 1)}>Next</Button>
            ) : (
              <Button onClick={handleEndInterview}>End Interview</Button>
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
