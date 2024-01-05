"use client";

import { spaceGrotesk } from "../fonts";
import { MdArrowOutward } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import Image from "next/image";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import signupPic from "@/public/images/hand2.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { log } from "console";

export default function Page() {
  const router=useRouter();
  // const [userName, setUserName] = useState("");
  const [username, setUsername] = useState(""); // Step 1: Add state for username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eyeClick, setEyeClick] = useState(true);
  const [error, setError] = useState(false);

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSignUp = async () => {
    const auth = getAuth(); // Get the auth instance
    const signUpFailed = () => toast.error('Sign Up Failed');
    const signUpSuccess =() => toast.success('Sign Up Success');
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if(username===""){
          setUsername(email);
        }
        await updateProfile(user, { displayName: username });
        setUsername(""); 
        router.push("/")
      }
    });
    try {
      const res = await createUserWithEmailAndPassword( email, password);

      if (res && res.user) {
        await updateProfile(res.user, { displayName: username }); // Update the profile
        (async () => { signUpSuccess()})();
       // console.log("Res is"+res);
        setEmail("");
        setPassword("");
        setUsername("");
        setError(false) ;// Reset the username
      }else{
        setError(true);
     (async () => { signUpFailed()})();
      }
    } catch (error) {
      setError(true);
      console.log("Error Occured");
      
      signUpFailed();
      console.error("Error:",error);
      
    }
  };

  return (
    <div
      className={`h-full md:min-h-screen relative overflow-hidden flex justify-center items-center min-w-full bg-gray-50`}
    >
      <Toaster   toastOptions={{ className: '',duration: 3000,style: { background: '#363636',color: '#fff',}}} />
         <div className="hidden md:flex md:w-1/2 h-screen items-center justify-center transition-all ease-out duration-500 ">
        <div className=" group   justify-center items-center">
          {/* <div className="text-4xl  text-black group-hover:text-5xl transition-all ease-in-out duration-500 font-bold">NAMMADA LOGO</div> */}
          <Image
            src={signupPic}
            alt="signup"
            width={600}
            height={600}
            className="scale-110"
          ></Image>
        </div>
      </div>
      {/* <div className="w-[1px] absolute bg-gray-950 opacity-30 h-[90%]"></div> */}
      <div className="md:w-1/2 w-full flex flex-col items-center justify-center">
        <div className="flex md:w-[50%] font-poppins text-4xl justify-items-start -ml-20 md:-ml-12 items-center  mb-5 ">
          <img src="/logo.png" className="w-[80px] scale-150 " />
          <div className="font-bold -ml-3">Flash Drive</div>
        </div>
        <div className="text-gray-950 md:text-2xl text-xl opacity-80 font-medium flex-col mb-3 text-left md:w-1/2 w-full md:px-0 px-8 justify-start flex">
     {error && <div className="text-red-500">Error in SIgnup</div>}  {!error && <div className=""> Let&apos;s go...</div>} 
        </div>
        <div className="flex-col flex md:w-1/2   justify-items-start items-start ">
          {/* <label htmlFor="name" className="text-xl my-3 font-normal ml-2">
            Username
          </label>
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            className="inputField"
          /> */}
          <label htmlFor="username" className="text-xl my-3 font-normal ml-2"> {/* Add username label */}
        Username
      </label>
      <input
        type="text"
        id="username"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value); // Set the username
        }}
        className="inputField"
      />
          <label htmlFor="email" className="text-xl my-3 font-normal ml-2">
            Email
          </label>
          <input
            type="text"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="inputField"
          />
          <label
            htmlFor="password"
            className="text-xl  mb-2 mt-3 font-normal ml-2"
          >
            Password
          </label>
          <div className="w-full relative flex">
            <input
              type={eyeClick ? "password" : "text"}
              id="password"
              placeholder="Password (8 + chars)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="inputField"
            ></input>
            {eyeClick ? (
              <FaEye
                onClick={() => {
                  setEyeClick(!eyeClick);
                }}
                className="absolute right-0 mr-4 mt-3 text-xl text-gray-950 opacity-50 hover:opacity-100 cursor-pointer"
              />
            ) : (
              <FaEyeSlash
                onClick={() => {
                  setEyeClick(!eyeClick);
                }}
                className="absolute right-0 mr-4 mt-3 text-xl text-gray-950 opacity-50 hover:opacity-100 cursor-pointer"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col mt-4 gap-4 md:w-[50%] w-full">
          {/* <a href="" className="text-right text-blue-700 hover:text-blue-500 mb-3">Forgot Password?</a> */}
          <button
            className="bg-[#f4fd6b] hover:bg-[#faffaf] transition-all duration-100 ease text-xxl py-4 md:px-6 mx-6 md:mx-0  rounded-lg"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
        <div className="flex justify-between  items-center w-full md:px-0 px-6 md:w-[50%] my-5 ">
          <div className="bg-gray-950 w-[80px] h-[1px] opacity-30"></div>
          Or signup using
          <div className="bg-gray-950 w-[80px] h-[1px] opacity-30"></div>
        </div>
        <div className=" flex justify-between  w-full md:px-0 px-6 md:w-[50%] ">
          <button className="bg-blue-300 w-[48%] py-3 hover:bg-blue-200 rounded-lg">
            Google
          </button>
          <button className="bg-blue-300 w-[48%]  py-3 hover:bg-blue-200 rounded-lg">
            GitHub
          </button>
        </div>
        <div className=" md:w-1/2 mt-10 flex  justify-center items-center">
          <p className="mr-2">Already an user?</p>
          <button className=" mr-1 flex rounded-full px-3 py-[2px] text-sm justify-center items-center bg-transparent border border-gray-950">
            <Link href={"/login"}>Log In</Link>
          </button>
          <div className="bg-[#f4fd6b] w-7 h-7 flex justify-center items-center rounded-full text-black">
            <MdArrowOutward />
          </div>
        </div>
      </div>
    </div>
  );
}
