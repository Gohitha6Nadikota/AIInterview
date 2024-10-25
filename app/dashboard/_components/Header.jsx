"use client";
import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
function Header() {
  const path = usePathname();
  return (
    <div className="flex gap-4 justify-between shadow-sm bg-[#3d52a0] items-center h-[9vh]">
      <h2 className="text-xl md:text-2xl text-white px-3 md:px-7">
        Interview Trainer
      </h2>
      <div className="mx-5 text-xl">
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
