import { UserButton } from "@clerk/nextjs";
import React from "react";
import AddInterview from "./_components/addInterview";
import Interviews from "./_components/Interviews";
function DashBoard() {
  return (
    <div className="p-20 bg-[#ede8f5]">
      <div className="flex gap-10 flex-col  mb-20">
        <h2 className="font-bold text-2xl md:text-4xl text-[#3d52a0]">
          Dashboard
        </h2>
        <h2 className="text-sm  md:text-3xl py-2 px-6 text-[#3d52a0]">
          Create and Start your AI mock Interview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 my-5 px-6">
          <AddInterview />
        </div>
      </div>
      <Interviews />
    </div>
  );
}

export default DashBoard;
