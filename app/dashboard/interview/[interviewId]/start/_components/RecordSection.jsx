"use client";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { chatSession } from "@/utils/ai";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import moment from "moment";
const RecordSection = ({ mockData, active, interviewData }) => {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const {
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  useEffect(() => {
    if (results.length > 0) {
      console.log(results + " results");
      setAnswer(
        (prevAnswer) =>
          prevAnswer + " " + results[results.length - 1].transcript
      );
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && answer.length > 10) UpdateAnswer();
  }, [answer]);

  const saveAnswer = () => {
    if (isRecording) {
      stopSpeechToText();
      if (!mockData || !mockData[active]) {
        toast("Error: Question data is missing.");
        setAnswer("");
        setResults([]);
        return;
      }
      if (answer?.length < 10) {
        console.log(answer + " answer length is less than 10");
        setLoading(false);
        toast("Error while saving your answer, Please record again");
        setAnswer("");
        setResults([]);
        return;
      }
    } else {
      startSpeechToText();
    }
  };

  const UpdateAnswer = async () => {
    setLoading(true);
    const prompt =
      "Question:" +
      mockData[active]?.question +
      ",User Answer" +
      answer +
      ",Depends on question and user answer for given question Please give us rating for answer and feedback as area of improvement if any" +
      "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

    const result = await chatSession.sendMessage(prompt);

    const resp = await result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    const jresp = JSON.parse(resp);
    const dbresp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockData[active]?.question,
      correctAns: mockData[active]?.answer,
      userAns: answer,
      feedback: jresp?.feedback,
      rating: jresp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-YYYY"),
    });
    console.log(answer + " data in db");
    if (dbresp) {
      toast("User Answer recorded successfully");
    }
    setAnswer("");
    setResults([]);
    setLoading(false);
  };
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center">
        <Image
          src={"/webcam1.jpg"}
          width={400}
          height={400}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 400,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button
        variant="outlined"
        disabled={loading}
        className="my-10 bg-white text-black"
        onClick={saveAnswer}
      >
        {isRecording ? (
          <h2 className="flex justify-center items-center p-2 text-md text-red-600">
            <StopCircle className="pr-2" /> Recording ... Click here to stop
          </h2>
        ) : (
          <h2 className="flex justify-center items-center p-2 text-md">
            <Mic className="pr-2" /> Record Answer
          </h2>
        )}
      </Button>
    </div>
  );
};

export default RecordSection;
