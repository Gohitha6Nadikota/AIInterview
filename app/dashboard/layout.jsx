"use client";
import React from "react";
import Header from "./_components/Header";
import { Toaster } from "@/components/ui/sonner";
function DashBoardlayout({ children }) {
  return (
    <div className="bg-[#ede8f5] min-h-screen">
      <Header />
      <div className="mx-5 md:mx-20 lg:mx-36">
        <Toaster />
        {children}
      </div>
    </div>
  );
}

export default DashBoardlayout;
