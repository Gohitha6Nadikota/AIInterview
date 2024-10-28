"use client";
import { eq } from "drizzle-orm";
import { MockInterview } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [webcamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    GetInterviewDetails();
  }, [params]);

  const GetInterviewDetails = async () => {
    try {
      const data = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      setInterviewData(data[0]);
    } catch (error) {
      console.error("Error fetching interview data:", error);
    }
  };

  return (
    <div className="flex items-center flex-col justify-center min-h-[91vh]">
      <h2 className="font-bold text-3xl mb-10 text-[#0d92f4]">
        Let's Get started
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
          <div className="flex flex-col gap-5 p-5 rounded-lg border border-[#0d92f4] text-[#0d92f4]">
            {interviewData ? (
              <>
                <h2 className="text-lg">
                  <strong>Job Role/Job Position :</strong>{" "}
                  {interviewData.jobPosition}
                </h2>
                <h2 className="text-lg">
                  <strong>Job Description/TechStack :</strong>{" "}
                  {interviewData.jobDescription}
                </h2>
                <h2 className="text-lg">
                  <strong>Years of Experience:</strong>{" "}
                  {interviewData.jobExperience}
                </h2>
              </>
            ) : (
              <p>Loading interview details...</p>
            )}
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-600">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-600">
              Enable Video Web Cam and Microphone to Start your AI Mock
              Interview. It has 5 questions which you can answer and at last
              you'll get the report of your performance.
            </h2>
            <h2 className="mt-3 text-yellow-600">
              NOTE: We never record your video, You can disable it any time
            </h2>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          {webcamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
                text: "black",
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 rounded-lg bg-secondary border text-md" />
              <Button
                className="w-full bg-[#0d92f4]"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex items-end justify-end mt-10 pb-4">
        <Link href={"/dashboard/interview/" + params.interviewId + "/start"}>
          <Button className="bg-[#0d92f4] text-lg">Start Interview</Button>
        </Link>
      </div>
    </div>
  );
};

export default Interview;
