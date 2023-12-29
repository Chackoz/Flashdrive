"use client";
import { useState } from "react";
import { spaceGrotesk } from "../fonts";
import { MdArrowOutward } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth } from "@/app/firebase/config";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import Link from "next/link";
import Image from "next/image";
import loginPic from "@/public/images/space.png";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


export default function Page() {
  const [error, setError] = useState("");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eyeClick, setEyeClick] = useState(true);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleLogin = async () => {
    console.log("Email is " + email);
    console.log("Password is " + password);

    try {
      const res = await signInWithEmailAndPassword(email, password);
      setEmail("");
      setPassword("");
      console.log(res);
      if (res && res.user) {
        router.push("/home");
        setError("")
      } else {
        setError("Login failed. ");
        
      }
    } catch (error) {
      console.error(error);
     
     
    }
  };

  return (
    <div
      className={`${spaceGrotesk.className} min-h-screen relative overflow-hidden flex justify-center items-center min-w-full bg-gray-50`}
    >
      <div className="w-1/2 h-screen flex items-center justify-center transition-all ease-out duration-500 ">
        <div className=" group  flex justify-center items-center">
          {/* <div className="text-4xl  text-black group-hover:text-5xl transition-all ease-in-out duration-500 font-bold">NAMMADA LOGO</div> */}
          <Image
            src={loginPic}
            alt="login"
            width={600}
            height={600}
            className="scale-110"
          ></Image>
        </div>
      </div>
      {/* <div className="w-[1px] absolute bg-gray-950 opacity-30 h-[90%]"></div> */}
      <div className="w-1/2 h-screen flex flex-col items-center justify-center">
        <div className="flex w-[50%] font-poppins text-4xl justify-start items-start">
          <img src="/logo.png" className="w-[80px] -mt-4 -ml-6" />
          <div className="">Flash Drive</div>
        </div>
        <div className="text-gray-950 text-2xl font-medium flex-col mb-3 text-left w-1/2 justify-start flex ">
        {error && <div className="error-message">{error}</div>} {!error && <div>Nice to see you again.</div> }   
        </div>
        <div className="flex-col flex w-1/2   justify-items-start items-start ">
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
              placeholder="Password"
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
        <div className="flex flex-col mt-4 gap-4 w-[50%]">
          <a
            href=""
            className="text-right text-blue-700 hover:text-blue-500 mb-3"
          >
            Forgot Password?
          </a>
          <button
            className="bg-[#f4fd6b] hover:bg-[#faffaf] transition-all duration-100 ease text-xxl py-4 px-6  rounded-lg"
            onClick={handleLogin}
          >
            Log In
          </button>
        </div>
        <div className="flex justify-between items-center w-[50%] my-5 ">
          <div className="bg-gray-950 w-[80px] h-[1px] opacity-30"></div>
          Or login with
          <div className="bg-gray-950 w-[80px] h-[1px] opacity-30"></div>
        </div>
        <div className=" flex justify-between w-[50%] ">
          <button className="bg-blue-300 w-[48%] py-3 hover:bg-blue-200 rounded-lg">
            Google
          </button>
          <button className="bg-blue-300 w-[48%]  py-3 hover:bg-blue-200 rounded-lg">
            GitHub
          </button>
        </div>
        <div className="  w-1/2 mt-10 flex  justify-center items-center">
          <p className="mr-2">Newbie??</p>
          <button className=" mr-1 flex rounded-full px-3 py-[2px] text-sm justify-center items-center bg-transparent border border-gray-950">
            <Link href={"/signup"}>Sign Up</Link>
          </button>
          <div className="bg-[#f4fd6b] w-7 h-7 flex justify-center items-center rounded-full text-black">
            <MdArrowOutward />
          </div>
        </div>
      </div>
    </div>
  );
}
