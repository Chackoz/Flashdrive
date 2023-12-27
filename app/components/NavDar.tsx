import React from 'react'

const navbarProps={
  mode : String
}

function NavDar() {
  return (
    <div className=' flex p-5 justify-between items-center font-poppins md:max-w-[1500px] w-full mx-auto text-white bg-[#1d1d1d] rounded-xl'>
        <div className='font-logo text-xl '>⚡FLASH DRIVE</div>
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

export default NavDar