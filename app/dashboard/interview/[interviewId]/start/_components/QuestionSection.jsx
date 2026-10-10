"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";

const QuestionSection = ({ questions, active, onSelect, disabled }) => {
  useEffect(
    () => () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    },
    []
  );

  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      toast("Sorry, your browser does not support Text to Speech", { duration: 3000 });
    }
  };

  return (
    <div className="p-5 rounded-lg border my-10 ">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 py-2">
        {questions.map((q, index) => (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(index)}
            className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer disabled:cursor-not-allowed ${active === index ? "bg-primary text-white" : "bg-[#0d92f4]"
              }`}
          >
            Question #{index + 1}
          </button>
        ))}
      </div>

      <div className="my-5 text-md md:text-lg flex text-[#0d92f4]">
        <Volume2
          size={44}
          className="mx-2 text-[#0d92f4] text-xl hover:cursor-pointer"
          onClick={() => textToSpeech(questions[active]?.question)}
        />
        <h2 className="text-black">{questions[active]?.question}</h2>
      </div>
      <div className="border rounded-lg p-5 bg-blue-100 mt-20">
        <h2 className="flex gap-2 items-center text-primary">
          <Lightbulb />
          <strong>NOTE:</strong>
        </h2>
        <p className="text-sm my-2 text-primary">
          Click on Record Answer when you want to answer the question. At the
          end of interview we will give you the feeback along with the correct
          answer for each of the question and your answer to compare it.
        </p>
      </div>
    </div>
  );
};

export default QuestionSection;
