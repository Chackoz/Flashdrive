'use client'
import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from "../hooks/useAuth";
import { FaUserAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { FaUserPen } from "react-icons/fa6";
import Modal from '../components/Modal'
import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
const page = () => {
  const [modal,setModal] = useState(false);
  const user = useAuth();
  const handleImageSelect=(num:number | null)=>{
    console.log("Selected Image no is "+num);

    setModal(false);
  }
 
  return (
<main className={` flex flex-col items-center justify-center w-full h-full relative min-h-screen md:p-0 pt-5 `}>
 {modal &&  <div className='h-screen w-screen  z-20 flex flex-col justify-center items-center absolute'>
   <div className=' flex flex-col  items-end px-7'>
   <div onClick={()=>setModal(!modal)} className='cursor-pointer mb-5'> <AiOutlineClose size="2rem"/></div>
    <Modal onSelectImage={handleImageSelect}></Modal>
   </div>
  </div>
  }
    <Navbar></Navbar>
    {user && 
      <div className={`  ${modal? 'blur' : ''} flex bg-red w-[80%] h-full items-center justify-center `}>
        <div className='w-[80%] gap-4  flex  justify-between'>
           <div onClick={()=>setModal(!modal)} className='bento flex justify-center group items-center cursor-pointer'>
          
            <div className=' flex w-full h-full opacity-55 group-hover:scale-150  justify-center items-center transition-all ease duration-100 ' >
            <FaUserPen size='3rem' color='gray' />
            </div>
            </div>
            <div className='bento w-[80%] flex items-center'>
            {user && <div className='text-7xl font-logo'>{user.displayName}</div>}
              
            </div>
            <div className='bento flex justify-around items-center flex-col'>
              <div className='text-center'>Images Generated</div>
            <div className='font-logo text-5xl'>0</div>
            </div>
           
           
        </div>
      </div>
    
    }
    

    {!user && (
        <div className="flex flex-col justify-center items-center w-full h-full text-6xl ">
          <img src="/images/gaurddog.png" />
          <div className="font-poppins p-5 text-center text-[3rem] md:text-[4rem]">
            Please Log in to use the web service
          </div>
          <a
            href="/login"
            className="text-[1.5rem] border-black border-[1px] rounded-full px-5 p-1"
          >
            Log In
          </a>
        </div>
      )}
    </main>
      )
}

export default page