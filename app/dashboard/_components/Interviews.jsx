"use client";

import { listInterviews } from "@/utils/actions";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import InterviewCard from "./InterviewCard";

const Interviews = () => {
  const { user } = useUser();
  const [list, setList] = useState([]);
  useEffect(() => {
    user && getList();
  }, [user]);
  const getList = async () => {
    try {
      setList(await listInterviews());
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  return (
    <div className="px-2">
      <h2 className="p-3 text-3xl mb-8 text-[#3d52a0]">
        Previous Mock Interview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {list.length > 0 &&
          list.map((item) => (
            <InterviewCard interview={item} key={item.id} />
          ))}
      </div>
    </div>
  );
};

export default Interviews;
