import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";

function Navbar() {
  
  const user = useAuth();
  
  const checkUser = async () => {
    if(!user) {
      console.log("Navbar Not logged in");
  
    } if(user) {
     
    }
  };
  
useEffect(() => {
  
  checkUser();
  

  return () => {
    
  }
}, [user])

  return (
    <div className=" flex  justify-between items-center font-poppins mx-auto w-[90%]">
      <a href="/" className="flex cursor-pointer">
        <img src="/logo.png" className="w-[50px]" />
        <div className="font-logo text-xl py-5">FLASH DRIVE</div>
      </a>
      <div className="md:flex hidden gap-6">
        <a href="/">Home</a>
        <a href="/#portfolio">Portfolio</a>
        <a href="/">Smthn</a>
        <a href="/">Smthin</a>
      </div>
      {!user && (
        <a
          href="/login"
          className="border-black border-[1px] px-4 rounded-full cursor-pointer p-1 hover:bg-[#2d2d2d] hover:text-white transition-all duration-75"
        >
          Login
        </a>
      )}
      {user&& (
        <button
          onClick={() => {
            signOut(auth);
            
          }}
          className="border-black border-[1px] px-4 rounded-full cursor-pointer p-1 hover:bg-[#2d2d2d] hover:text-white transition-all duration-75"
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default Navbar;
