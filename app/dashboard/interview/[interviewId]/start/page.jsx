"use client";
import React, { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import QuestionSection from "./_components/QuestionSection";
import RecordSection from "./_components/RecordSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [mockData, setMockData] = useState(null);
  const [active, setActive] = useState(0);
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
            {active != mockData.length - 1 && (
              <Button onClick={() => setActive(active + 1)}>Next</Button>
            )}
            {active == mockData.length - 1 && (
              <Link
                href={
                  "/dashboard/interview/" + interviewData?.mockId + "/feedback"
                }
              >
                <Button>End Interview</Button>
              </Link>
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
