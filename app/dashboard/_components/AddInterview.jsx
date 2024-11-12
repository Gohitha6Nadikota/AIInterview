"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { chatSession } from "@/utils/ai";
import { LoaderCircleIcon } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

function AddInterview() {
  const [isStarted, setStarted] = useState(false);
  const [role, setRole] = useState("");
  const [desc, setDesc] = useState("");
  const [exp, setExp] = useState("");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  let isFormValid = role && desc && exp;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !desc || !exp) {
      isFormValid = false;
    }
    if (isFormValid == false) {
      alert(
        "Please fill out all fields and make sure experience is a positive number."
      );
      return;
    }

    setLoading(true);

    const input =
      "Job Position:" +
      role +
      " ,Job Description:" +
      desc +
      ",Years of Experience: " +
      exp +
      ", Depends on this information please give me 5 Interview question with Answered in Json Format, Give Question and Answered as field in JSON. Dont give any additional data or comments in the response only i need the json. Question to be tagged as 'question' and answer as 'answer'";
    const result = await chatSession.sendMessage(input);
    const resp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    setResponse(resp);

    if (resp) {
      const dbresp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: resp,
          jobPosition: role,
          jobDescription: desc,
          jobExperience: exp,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });

      if (dbresp) {
        const mockId = dbresp[0].mockId;
        setStarted(false);
        router.push("/dashboard/interview/" + mockId);
      }
    } else {
      console.log("Error in getting response from AI");
    }
    setLoading(false);
  };

  return (
    <div className="">
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 transition-all hover:shadow-md cursor-pointer"
        onClick={() => setStarted(true)}
      >
        <div className="text-sm md:text-2xl text-center text-black">
          + Add New
        </div>
      </div>

      <Dialog open={isStarted} onOpenChange={(open) => setStarted(open)}>
        <DialogContent className="max-w-4xl bg-white text-black">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl p-3 text-[#4f6cd6]">
              Tell us more about the interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit}>
                <div className="text-[#3d52a0] text-xl font-medium mb-2">
                  <h2 className="px-4">
                    Describe about the Job role, Job description, and years of
                    experience
                  </h2>
                  <div className="mt-7 my-5 text-xl">
                    <label className="text-xl font-medium mb-5 px-1">
                      Job Role
                    </label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      className="text-sm p-3 border border-[#0D92F4]"
                      required={true}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>

                  <div className="my-5">
                    <label className="text-xl font-medium mb-5 px-1">
                      Job Description (In short)
                    </label>
                    <Input
                      placeholder="Ex. React, Mysql, NodeJs"
                      required={true}
                      value={desc}
                      className="text-sm p-3 border border-[#0D92F4]"
                      onChange={(e) => setDesc(e.target.value)}
                    />
                  </div>

                  <div className="my-5">
                    <label className="text-xl font-medium mb-5 px-1">
                      Years of Experience
                    </label>
                    <Input
                      placeholder="Ex. 5"
                      type="number"
                      required={true}
                      value={exp}
                      className="text-sm p-3  border border-[#0D92F4]"
                      onChange={(e) => setExp(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end text-xl">
                  <Button
                    type="button"
                    className="bg-[#7091e6] text-lg"
                    onClick={() => setStarted(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className={`"bg-[#b2ce63]" ${
                      !isFormValid || loading ? "bg-[#b2ce63]" : "bg-[#0D92F4]"
                    }text-xl`}
                    disabled={!isFormValid || loading}
                  >
                    {loading ? <LoaderCircleIcon /> : "Start Interview"}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddInterview;
