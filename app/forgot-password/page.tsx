"use client"
import React from 'react'
import ForgotPassword from '../components/ForgotPassword'
import Navbar from '../components/Navbar'
import Link from 'next/link'

function page() {
  return (
    <div className='w-full min-h-screen flex flex-col justify-between' >
   
      <ForgotPassword/>
    
    </div>
  )
}

export default page
