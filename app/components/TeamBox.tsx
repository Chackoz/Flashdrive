import React from 'react'
import { FaInstagram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
function TeamBox() { 
  return (
    <div className='flex flex-col w-[350px] h-[550px] items-center justify-around bg-blue-100 rounded-2xl'>
        <div className='flex w-[300px] h-[420px] bg-blue-400 rounded-2xl'>
          <img src="" alt="Image" />
          </div>
        <div className='flex w-[300px] items-center h-[80px]'>
            <div className='flex flex-col justify-between w-[200px] h-[80px]'>
                <div className='flex w-[200px] h-[50px] text-2xl'>Nevia Sebastian</div>
                <div className='flex w-[200px] h-[50px] text-lg'>Team Member</div>
            </div>
            <div className=' flex w-full gap-2 justify-end items-center h-[50px]'>
              <a href="">
                 <FaInstagram size="25"/>
              </a>
              <a href="">
                 <BsTwitterX size="25"/>
              </a>
            </div>
        </div>
    </div>
  )
}

export default TeamBox