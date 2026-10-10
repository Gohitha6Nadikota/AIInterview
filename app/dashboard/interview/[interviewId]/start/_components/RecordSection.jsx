"use client";
import { toast } from "sonner";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { LoaderCircleIcon, Mic, RotateCcw, StopCircle } from "lucide-react";
import { saveAnswer } from "@/utils/actions";

const MIN_ANSWER_LENGTH = 10;
const MIC_START_TIMEOUT_MS = 6000;

const PHASE = {
  IDLE: "idle",
  STARTING: "starting",
  RECORDING: "recording",
  SAVING: "saving",
  FAILED: "failed",
};

const RecordSection = ({ questions, active, mockId, onBusyChange }) => {
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [pendingAnswer, setPendingAnswer] = useState(null);
  const recordingQuestionRef = useRef(null);
  const startTimerRef = useRef(null);

  const {
    error: speechError,
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
    onBusyChange?.(phase === PHASE.STARTING || phase === PHASE.RECORDING || phase === PHASE.SAVING);
  }, [phase]);

  useEffect(() => {
    if (speechError) {
      toast.error(speechError, { duration: 3000 });
    }
  }, [speechError]);

  useEffect(() => {
    setPendingAnswer(null);
    setResults([]);
    setPhase((current) => (current === PHASE.FAILED ? PHASE.IDLE : current));
  }, [active]);

  useEffect(() => {
    if (isRecording && phase === PHASE.STARTING) {
      clearTimeout(startTimerRef.current);
      setPhase(PHASE.RECORDING);
    }
    if (!isRecording && phase === PHASE.RECORDING) {
      finishRecording();
    }
  }, [isRecording, phase]);

  useEffect(
    () => () => {
      clearTimeout(startTimerRef.current);
      stopSpeechToText();
    },
    []
  );

  const startRecording = async () => {
    if (!questions?.[active]?.question) {
      toast.error("Question data is missing. Please reload the page.", { duration: 3000 });
      return;
    }
    recordingQuestionRef.current = active;
    setResults([]);
    setPendingAnswer(null);
    setPhase(PHASE.STARTING);

    clearTimeout(startTimerRef.current);
    startTimerRef.current = setTimeout(() => {
      stopSpeechToText();
      setPhase((current) => (current === PHASE.STARTING ? PHASE.IDLE : current));
      toast.error("Could not access the microphone. Check the mic permission and try again.", { duration: 3000 });
    }, MIC_START_TIMEOUT_MS);

    try {
      await startSpeechToText();
    } catch (e) {
      console.error("Failed to start speech recognition", e);
      clearTimeout(startTimerRef.current);
      stopSpeechToText();
      setPhase(PHASE.IDLE);
      toast.error("Could not start recording. Please try again.", { duration: 3000 });
    }
  };

  const finishRecording = () => {
    const transcript = results
      .map((result) => result.transcript)
      .join(" ")
      .trim();
    setResults([]);

    if (transcript.length < MIN_ANSWER_LENGTH) {
      setPhase(PHASE.IDLE);
      toast.warning("We couldn't catch your answer. Please record again.", { duration: 3000 });
      return;
    }

    submitAnswer({ questionIndex: recordingQuestionRef.current, userAns: transcript });
  };

  const submitAnswer = async (entry) => {
    setPhase(PHASE.SAVING);
    try {
      await saveAnswer({ mockId, ...entry });
      setPendingAnswer(null);
      setPhase(PHASE.IDLE);
      toast.success("Answer saved successfully", { duration: 2000 });
    } catch (e) {
      console.error("Failed to save answer", e);
      setPendingAnswer(entry);
      setPhase(PHASE.FAILED);
      toast.error("Failed to save your answer. You can retry or record again.", { duration: 3000 });
    }
  };

  const onRecordClick = () => {
    if (phase === PHASE.RECORDING) {
      stopSpeechToText();
    } else if (phase === PHASE.IDLE || phase === PHASE.FAILED) {
      startRecording();
    }
  };

  const renderRecordLabel = () => {
    switch (phase) {
      case PHASE.STARTING:
        return (
          <span className="flex justify-center items-center p-2 text-md">
            <LoaderCircleIcon className="pr-2 animate-spin" /> Starting microphone...
          </span>
        );
      case PHASE.RECORDING:
        return (
          <span className="flex justify-center items-center p-2 text-md text-red-600">
            <StopCircle className="pr-2" /> Recording ... Click here to stop
          </span>
        );
      case PHASE.SAVING:
        return (
          <span className="flex justify-center items-center p-2 text-md">
            <LoaderCircleIcon className="pr-2 animate-spin" /> Saving your answer...
          </span>
        );
      case PHASE.FAILED:
        return (
          <span className="flex justify-center items-center p-2 text-md">
            <Mic className="pr-2" /> Record Again
          </span>
        );
      default:
        return (
          <span className="flex justify-center items-center p-2 text-md">
            <Mic className="pr-2" /> Record Answer
          </span>
        );
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center">
        <Image
          src={"/webcam1.jpg"}
          alt="Webcam placeholder"
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
      <div className="flex gap-4 my-10">
        <Button
          variant="outlined"
          disabled={Boolean(speechError) || phase === PHASE.STARTING || phase === PHASE.SAVING}
          className="bg-white text-black"
          onClick={onRecordClick}
        >
          {renderRecordLabel()}
        </Button>
        {phase === PHASE.FAILED && pendingAnswer && (
          <Button
            variant="outlined"
            className="bg-white text-black"
            onClick={() => submitAnswer(pendingAnswer)}
          >
            <span className="flex justify-center items-center p-2 text-md">
              <RotateCcw className="pr-2" /> Retry Saving
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecordSection;
