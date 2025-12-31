import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const InterviewItemCard = ({interview}) => {

  const router = useRouter();

  const onStart=()=>{
    router.push('/dashboard/interview/'+interview?.mockId)
  }
  const onFeedbackPress=()=>{
    router.push('/dashboard/interview/'+interview?.mockId+'/feedback')
  }
  
  return (
    <div className='border shadow-sm rounded-lg p-3'>
      <h2 className='font-bold text-primary'>
        {interview?.jobPosition}
      </h2>
      <h2 className='text-sm text-gray-600'>
        Experience: {interview?.jobExperience} yrs
      </h2>
      <h2 className='text-xs texr-gray-500'>
        CreatedAt: {interview.createdAt}
      </h2>
      {/* <div className='flex justify-between mt-2 gap-5 w-full'>
        <Button size='sm' variant="outline" onClick={onStart}
        >Feedback</Button>
        <Button size='sm' onClick={onFeedbackPress}>Start</Button>
      </div> */}
      <div className="flex mt-3 gap-4 w-full">
  <Button
    size="sm"
    variant="outline"
    onClick={onFeedbackPress}
    className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
  >
    Feedback
  </Button>

  <Button
    size="sm"
    onClick={onStart}
    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
  >
    Start
  </Button>
</div>


    </div>
  )
}

export default InterviewItemCard