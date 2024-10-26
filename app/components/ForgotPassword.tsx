"use client";
import { useState } from "react";

import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import Image from "next/image";
import loginPic from "@/public/images/space.png";
import Navbar from "./Navbar";
import { auth } from "../(services)/firebase/config";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    const resetFailed = () => toast.error("Password Reset Failed");
    const resetSuccess = () => toast.success("Reset Email Sent");

    try {
      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
      resetSuccess();
      setEmail("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to send reset email. Please check your email address.");
      resetFailed();
    }
  };

  return (
    <div className="flex flex-col w-full h-full min-h-screen justify-between items-center">
      <Navbar />
      <Toaster
        toastOptions={{
          className: "",
          duration: 3000,
          style: { background: "#363636", color: "#fff" },
        }}
      />

      <div className="w-full flex">
        <div className="hidden md:flex md:w-1/2  items-center justify-center transition-all ease-out duration-500">
          <div className="group justify-center items-center">
            <Image
              src={loginPic}
              alt="login"
              width={600}
              height={600}
              className="scale-110"
            />
          </div>
        </div>

        <div className="md:w-1/2 w-full flex flex-col items-center justify-center">
          <div className="flex md:w-[50%] font-poppins text-4xl justify-items-start -ml-20 md:-ml-12 items-center mb-5">
            <img src="/logo.png" className="w-[80px] scale-150" />
            <div className="font-bold -ml-3">Flash Drive</div>
          </div>

          <div className="text-gray-950 md:text-2xl text-xl opacity-80 font-medium flex-col mb-3 text-left md:w-1/2 w-full md:px-0 px-8 justify-start flex">
            {error ? (
              <div className="error-message text-red-500">{error}</div>
            ) : (
              <div>Reset your password</div>
            )}
          </div>

          <div className="flex-col flex md:w-1/2 justify-items-start items-start">
            <label htmlFor="email" className="text-xl my-3 font-normal ml-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inputField"
            />
          </div>

          <div className="flex flex-col mt-4 gap-4 md:w-[50%] w-full">
            <button
              className="bg-[#1b1b1b] hover:bg-[#3f3f3f] text-white transition-all duration-100 ease text-xl py-4 md:px-6 mx-6 md:mx-0 rounded-lg"
              onClick={handleResetPassword}
            >
              Send Reset Link
            </button>
          </div>

          <div className="md:w-1/2 mt-10 flex justify-center items-center">
            <p className="mr-2">Remember your password?</p>
            <button className="mr-1 flex rounded-full px-3 py-[2px] text-sm justify-center items-center bg-transparent border border-gray-950">
              <Link href="/login">Log In</Link>
            </button>
            <div className="bg-[#f4fd6b] w-7 h-7 flex justify-center items-center rounded-full text-black">
              <MdArrowOutward />
            </div>
          </div>
        </div>
      </div>
      <Link
         href="/"
          className="border-black border font-light rounded-full px-4 py-1 hover:bg-black hover:text-white text-center transition-all m-10"
         
        >
          HOMEPAGE
        </Link>
    </div>
  );
}
