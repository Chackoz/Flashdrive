"use client";
import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import Link from "next/link";
import Image from "next/image";
import loginPic from "@/public/images/space.png";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { setUsername } from "@/app/(services)/utils/localStorage";
import { auth } from "@/app/(services)/firebase/config";

export default function Page() {
  const [error, setError] = useState("");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eyeClick, setEyeClick] = useState(true);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const searchParams = useSearchParams();

  const handleLogin = async () => {
    console.log("Email is " + email);
    console.log("Password is " + password);
    const loginFailed = () => toast.error("Login Failed");
    const loginSuccess = () => toast.success("Login Success");
    try {
      const res = await signInWithEmailAndPassword(email, password);
      setEmail("");
      setPassword("");
      console.log(res);
      if (res && res.user) {
        (async () => {
          loginSuccess();
        })();
        setUsername(email);

        router.push("/");
        setError("");
      } else {
        setError("Login failed. ");
        loginFailed();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`h-full md:min-h-screen relative overflow-hidden flex justify-center items-center min-w-full bg-gray-50`}
    >
      <Toaster
        toastOptions={{
          className: "",
          duration: 3000,
          style: { background: "#363636", color: "#fff" },
        }}
      />
      <div className="hidden md:flex md:w-1/2 h-screen items-center justify-center transition-all ease-out duration-500 ">
        <div className=" group   justify-center items-center">
          <Image
            src={loginPic}
            alt="login"
            width={600}
            height={600}
            className="scale-110"
          ></Image>
        </div>
      </div>

      <div className="md:w-1/2 w-full flex flex-col items-center justify-center">
        <div className="flex md:w-[50%] font-poppins text-4xl justify-items-start -ml-20 md:-ml-12 items-center  mb-5">
          <img src="/logo.png" className="w-[80px] scale-150 " />
          <div className="font-bold -ml-3">Flash Drive</div>
        </div>
        <div className="text-gray-950 md:text-2xl text-xl opacity-80 font-medium flex-col mb-3 text-left md:w-1/2 w-full md:px-0 px-8 justify-start flex ">
          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div>Nice to see you again.</div>
          )}
        </div>
        <div className="flex-col flex md:w-1/2   justify-items-start items-start ">
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
        <div className="flex flex-col mt-4 gap-4 md:w-[50%] w-full">
          <a
            href="/forgot-password"
            className="text-right text-blue-700 hover:text-blue-500 mb-3 mr-6 md:mr-0"
          >
            Forgot Password?
          </a>
          <button
            className="bg-[#1b1b1b] hover:bg-[#3f3f3f] text-white transition-all duration-100 ease text-xl py-4 md:px-6 mx-6 md:mx-0  rounded-lg"
            onClick={handleLogin}
          >
            Log In
          </button>
        </div>

        <div className="  md:w-1/2 mt-10 flex  justify-center items-center">
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
