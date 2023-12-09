'use client'
import DoodleJumpGame from '@/app/components/DoodleJumpGame';

import React,{useState} from 'react'


const page:React.FC = () => {
  const [score, setScore] = useState<number>(0);



  const ScoreUpdate = (newValue: number) => {
      setScore(newValue);
  };
  return (
    <div className='flex flex-col justify-center items-center h-full bg-white w-full min-h-screen'>
      <div className='text-white text-xl'>Score: {score}</div>
      
    <DoodleJumpGame scoreUpdate={ScoreUpdate} />
  </div>
  )
}
export default page