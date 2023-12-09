import PongGame from '@/app/components/PongGame'
import React from 'react'

function page() {
  return (
    <div className='flex justify-center items-center h-full bg-white w-full min-h-screen'>
      <PongGame />
    </div>
  )
}

export default page