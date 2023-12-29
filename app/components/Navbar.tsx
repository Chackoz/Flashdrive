import React from 'react'

const navbarProps={
  mode : String
}

function Navbar() {
  return (
    <div className=' flex  justify-between items-center font-poppins md:max-w-[1500px] w-full mx-auto md:p-0 pr-5'>
        <div className='flex'><img src='/logo.png' className='w-[50px]'/><div className='font-logo text-xl py-5'>FLASH DRIVE</div></div>
        <div className='md:flex hidden gap-4'>
            <div>Home</div>
            <div>Home</div>
            <div>Home</div>
            <div>Home</div>
        </div>
        <div className='border-black border-[1px] px-2 rounded-full'>CONTACT</div>
    </div>
  )
}

export default Navbar