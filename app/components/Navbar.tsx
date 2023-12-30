import React from 'react'

const navbarProps={
  mode : String
}

function Navbar() {
  return (
    <div className=' flex  justify-between items-center font-poppins md:max-w-[1500px] w-full mx-auto md:p-0 pr-5'>
        <div className='flex'><img src='/logo.png' className='w-[50px]'/><div className='font-logo text-xl py-5'>FLASH DRIVE</div></div>
        <div className='md:flex hidden gap-6'>
            <a href='/'>Home</a>
            <a href='/#portfolio'>Portfolio</a>
            <a href='/'>Smthn</a>
            <a href='/'>Smthin</a>
        </div>
        <a href="/login" className='border-black border-[1px] px-4 rounded-full cursor-pointer p-1 hover:bg-[#2d2d2d] hover:text-white transition-all duration-75'>Login</a>
    </div>
  )
}

export default Navbar