"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard';

const InterviewList = () => {

  const {user} = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(()=>{
    user && GetInterviewList();
  }, [user])
  const GetInterviewList=async()=>{
    const result = await db.select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(MockInterview.id));

    console.log(result);
    setInterviewList(result);
  }
  return (
    <div>
      <h2 className='font-medium text-xl'
      > Previous Mock Interview </h2>

      {interviewList?.length === 0 ? (
        <p className="text-sm text-gray-500 my-4">
          No mock interviews created yet. Click "+ Add New" above to create your first interview.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
          {interviewList.map((interview, index) => (
            <InterviewItemCard
              interview={interview}
              refreshData={GetInterviewList}
              key={interview.id || index}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default InterviewList