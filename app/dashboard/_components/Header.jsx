"use client";
import React from 'react'
import Image  from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
function Header() {
  const path=usePathname();
  return (
    <div className="flex gap-4 justify-between shadow-sm bg-secondary items-center">
      <Image
        src={"./logo.svg"}
        width={60}
        height={60}
        alt="logo"
        className="p-4"
      />
      <ul className="hidden md:flex gap-6">
        <li
          className={`hover:text-primary hover:font-bold transition cursor-pointer ${
            path == "/dashboard" && "text-primary font-bold"
          }`}
        >
          Dashboard
        </li>
        <li className="hover:text-primary hover:font-bold transition cursor-pointer">
          Questions
        </li>
        <li className="hover:text-primary hover:font-bold transition cursor-pointer">
          Upgrade
        </li>
        <li className="hover:text-primary hover:font-bold transition cursor-pointer">
          Docs
        </li>
      </ul>
      <div className='mx-5'>
        <UserButton />
      </div>
    </div>
  );
}

export default Header