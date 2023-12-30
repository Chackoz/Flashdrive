import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import {auth} from '@/app/firebase/config'

function Navbar() {

  const [login,setLogin]=useState(false);
  const user =useAuth();
 const checkUser=async () => {
 
  if (!user) {
    console.log("Navbar Not logged in");

  }
 }

  return (
    <div className=' flex  justify-between items-center font-poppins mx-auto w-[90%] '>
        <div className='flex'><img src='/logo.png' className='w-[50px]'/><div className='font-logo text-xl py-5'>FLASH DRIVE</div></div>
        <div className='md:flex hidden gap-6'>
            <a href='/'>Home</a>
            <a href='/#portfolio'>Portfolio</a>
            <a href='/'>Smthn</a>
            <a href='/'>Smthin</a>
        </div>
        {login &&
        <a href="/login" className='border-black border-[1px] px-4 rounded-full cursor-pointer p-1 hover:bg-[#2d2d2d] hover:text-white transition-all duration-75'>Login</a>}
        {!login &&
        <button onClick={()=>{ signOut(auth);}} className='border-black border-[1px] px-4 rounded-full cursor-pointer p-1 hover:bg-[#2d2d2d] hover:text-white transition-all duration-75'>Login</button>}
    </div>
  )
}

export default Navbar