"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { eq, desc } from "drizzle-orm";
import InterviewCard from "./InterviewCard";

const Interviews = () => {
  const { user } = useUser();
  const [list, setList] = useState([]);
  useEffect(() => {
    user && getList();
  }, [user]);
  const getList = async () => {
    const res = await db
      .select()
      .from(MockInterview)
      .where(
        eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
      )
      .orderBy(desc(MockInterview.id));

    setList(res);
  };

  return (
    <div className="px-2">
      <h2 className="p-3 text-3xl mb-8 text-[#3d52a0]">
        Previous Mock Interview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {list.length > 0 &&
          list.map((item, index) => (
            <InterviewCard interview={item} key={index} />
          ))}
      </div>
    </div>
  );
};

export default Interviews;
