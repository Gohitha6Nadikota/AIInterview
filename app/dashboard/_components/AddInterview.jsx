"use client";
import React,{useState} from 'react'
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

function AddInterview() {
  const [isStarted,setStarted]=useState(false);
  const [role,setRole]=useState("");
  const [desc,setDesc]=useState("");
  const [exp,setExp]=useState(0);
  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log(role,desc,exp);
  }
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 transition-all hover:shadow-md cursor-pointer"
        onClick={() => setStarted(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={isStarted}>
        <DialogContent className="max-w-2xl bg-white text-black">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Tell us more about the interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit}>
                <div>
                  <h2>
                    Describe about the Job role , Job description and years of
                    experience
                  </h2>
                  <div className="mt-7 my-3">
                    <label>Job Role</label>
                    <Input placeholder="Ex. Full Stack Developer" required onChange={(e)=>setRole(e.target.value)}/>
                  </div>
                  <div className="my-3">
                    <label>Job Description (In short)</label>
                    <Input placeholder="Ex. React, Mysql , NodeJs" required onChange={(e)=>setDesc(e.target.value)}/>
                  </div>
                  <div className="my-3">
                    <label>Years of Experience</label>
                    <Input placeholder="Ex. 5" type="number" required  onChange={(e)=>setExp(e.target.value)}/>
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                  <Button type="submit">Start Interview</Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddInterview