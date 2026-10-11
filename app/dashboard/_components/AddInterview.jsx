"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createInterview } from "@/utils/actions";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddInterview() {
  const [isStarted, setStarted] = useState(false);
  const [role, setRole] = useState("");
  const [desc, setDesc] = useState("");
  const [exp, setExp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isFormValid =
    role.trim() !== "" &&
    desc.trim() !== "" &&
    exp.trim() !== "" &&
    Number.isFinite(Number(exp)) &&
    Number(exp) >= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.warning("Please fill out all fields and make sure experience is a positive number.", { duration: 3000 });
      return;
    }

    setLoading(true);
    try {
      const mockId = await createInterview({ role, desc, exp });
      setStarted(false);
      router.push("/dashboard/interview/" + mockId);
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error("Could not generate interview questions. Please try again.", { duration: 3000 });
    } finally {
      setLoading(false);
    }
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
                      required
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
                      required
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
                      min="0"
                      required
                      value={exp}
                      className="text-sm p-3 border border-[#0D92F4]"
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
                    className={`${!isFormValid ? "bg-[#b2ce63]" : "bg-[#0D92F4]"
                      } text-xl`}
                    disabled={!isFormValid || loading}
                  >
                    {loading ? (
                      <LoaderCircleIcon className="animate-spin" />
                    ) : (
                      "Start Interview"
                    )}
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
