import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const InterviewCard = ({ interview }) => {
  const router = useRouter();
  const onStart = () => {
    router.push("/dashboard/interview/" + interview?.mockId);
  };
  const handleFeedback = () => {
    router.push("/dashboard/interview/" + interview?.mockId + "/feedback");
  };
  return (
    <div className="border shadow-sm rounded-lg p-3 border-[#3d52a0] flex flex-col gap-5">
      <h2 className="font-bold text-primary text-lg">
        {interview?.jobPosition}
      </h2>
      <h2 className="text-sm text-[#7091e6]">
        {interview?.jobExperience} Years of Experience
      </h2>
      <h2 className="text-xs text-black font-semibold">
        Created At: {interview?.createdAt}
      </h2>
      <div className="flex justify-between mt-2 gap-5">
        <Button
          size="sm"
          className="w-1/2 bg-[#7091e6]"
          onClick={handleFeedback}
        >
          FeedBack
        </Button>
        <Button size="sm" className="w-1/2" onClick={onStart}>
          Start
        </Button>
      </div>
    </div>
  );
};

export default InterviewCard;
