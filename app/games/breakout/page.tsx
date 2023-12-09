'use client'
import BreakoutGame from '@/app/components/Breakout';

import React,{useState} from 'react'


const page:React.FC = () => {
  const [score, setScore] = useState<number>(0);



  const ScoreUpdate = (newValue: number) => {
      setScore(newValue);
  };
  return (
    <div className='flex flex-col justify-center items-center h-full w-full min-h-screen'>
      <div className='text-white text-xl'>Score: {score}</div>
    <BreakoutGame scoreUpdate={ScoreUpdate} />
  </div>
  )
}
export default page