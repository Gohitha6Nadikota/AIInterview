"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";

const QuestionSection = ({ mockData, active }) => {
  useEffect(() => {}, [mockData]);
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      toast("Sorry, your browser does not support Text to Speech");
    }
  };
  return (
    <div className="p-5 rounded-lg border my-10 ">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 py-2">
        {mockData &&
          mockData.map((q, index) => (
            <h2
              key={index}
              className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${
                active === index ? "bg-primary text-white" : "bg-[#0d92f4]"
              }
              }`}
            >
              Question #{index + 1}
            </h2>
          ))}
      </div>

      <h2 className="my-5 text-md md:text-lg flex text-[#0d92f4]">
        <Volume2
          size={44}
          className="mx-2 text-[#0d92f4] text-xl hover:cursor-pointer"
          onClick={() => textToSpeech(mockData[active]?.question)}
        />
        <h2 className="text-black">{mockData[active]?.question}</h2>
      </h2>
      <div className="border rounded-lg p-5 bg-blue-100 mt-20">
        <h2 className="flex gap-2 items-center text-primary">
          <Lightbulb />
          <strong>NOTE:</strong>
        </h2>
        <h2 className="text-sm my-2 text-primary">
          Click on Record Answer when you want to answer the question. At the
          end of interview we will give you the feeback along with the correct
          answer for each of the question and your answer to compare it.
        </h2>
      </div>
    </div>
  );
};

export default QuestionSection;
