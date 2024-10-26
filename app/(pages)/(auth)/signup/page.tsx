"use client";
import { MdArrowOutward } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

import Image from "next/image";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, sendEmailVerification } from "firebase/auth";
import signupPic from "@/public/images/hand2.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { log } from "console";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/app/(services)/firebase/config";
import { setUsername } from "@/app/(services)/utils/localStorage";
const userRef = collection(db, "user");

export default function Page() {
  const router=useRouter();
  // const [userName, setUsername1] = useState("");
  const [username, setUsername1] = useState(""); // Step 1: Add state for username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eyeClick, setEyeClick] = useState(true);
  const [error, setError] = useState(false);
  const [comment,setComment] =useState('');



  const comments = {
    veryShort: [
      "Whoa, slow down! Your password is shorter than a sneeze. Add some flair!🤧🌟",
      "Brevity is the soul of wit, but let's not get too brief with the password, shall we?🚶🏻👻",
      "This password is shorter than a goldfish's attention span! Let's spice it up a bit.🐡🌶️",
    ],
    short: [
      "A bit too short. Consider a longer password for better security.🩳🔐",
      "Hmm, seems a tad brief. Add a sprinkle of characters for an extra dash of security!🔑✨",
      "Short and snappy, just like a haiku! How about stretching it out a bit?📝🤸‍♂️",
    ],
    medium: [
      "Good job! This is a decent length.🤗🤑",
      "Nice! A password like this is like a good joke - not too short, not too long!😁🤡",
      "You're in the sweet spot! Not too short, not too long. Keep rocking!🎸🙌",
    ],
    long: [
      "Excellent choice! This is a strong and secure password.👮💪",
      "You've created a password masterpiece! It's practically a work of art!👨‍🎨🎨",
      "Well done! A longer password is like a fortress for your digital kingdom!👑🏰",
      "Impressive length! Your password is longer than a giraffe's neck. Keep it up!🦒📏",
    ],
    veryLong: [
      "Wow! Your password is longer than a Shakespearean play! Impressive!🎭✍️",
      "Bravo! This password is so long it might as well have its own theme song!🎶🎸",
      "Predicting you'll remember this? Your password is more mysterious than a cat in a magic show! Abracadabra!🐈🪄"
    ],
  };

  const selectComment=(password:any)=> {
     if (password.length < 5) {
    setComment(comments.veryShort[Math.floor(Math.random() * comments.veryShort.length)]) ;
  } else if (password.length >= 5 && password.length < 8) {
    setComment(comments.short[Math.floor(Math.random() * comments.short.length)]) ;
  } else if (password.length >= 8 && password.length <= 10) {
    setComment(comments.medium[Math.floor(Math.random() * comments.medium.length)]) ;
  } else if (password.length > 10 && password.length <= 15) {
    setComment(comments.long[Math.floor(Math.random() * comments.long.length)]) ;
  } else {
    setComment(comments.veryLong[Math.floor(Math.random() * comments.veryLong.length)]) ;
  }
  }

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSignUp = async () => {
    const auth = getAuth(); // Get the auth instance
    const signUpFailed = () => toast.error('Sign Up Failed');
    const signUpSuccess =() => toast.success('Sign Up Success');
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if(username===""){
          setUsername1(email);
        }
        await updateProfile(user, { displayName: username });
        setUsername1(""); 
        setUsername(email)
        router.push("/")
      }
    });
    try {
      const res = await createUserWithEmailAndPassword( email, password);

      if (res && res.user) {
        await updateProfile(res.user, { displayName: username }); // Update the profile
        await sendEmailVerification(res.user);
        (async () => { signUpSuccess()})();
       // console.log("Res is"+res);
        setEmail("");
        setPassword("");
        setUsername1("");
        try{const querySnapshot = await getDocs(
          query(userRef, where("email", "==",email ))
        );
        if (querySnapshot.empty) {
          await addDoc(userRef, {
            email:email,
            pfp:1,
            username:username
          });
        }}catch(e){

        }
        
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
         

         {(comment == '')?  <Image
            src={signupPic}
            alt="signup"
            width={600}
            height={600}
            className="scale-110"
          ></Image>: <h2 className="text-5xl font-poppins ml-10 px-2">{comment}</h2>}
        
         
        </div>
      </div>
      {/* <div className="w-[1px] absolute bg-gray-950 opacity-30 h-[90%]"></div> */}
      <div className="md:w-1/2 w-full flex flex-col items-center justify-center">
        <div className="flex md:w-[50%] font-poppins text-4xl justify-items-start -ml-20 md:-ml-12 items-center   ">
          <img src="/logo.png" className="w-[80px] scale-150 " />
          <div className="font-bold -ml-3">Flash Drive</div>
        </div>
        <div className="text-gray-950 md:text-2xl text-xl opacity-80 font-medium flex-col mb-3 text-left w-full  md:px-0 px-8 justify-start items-center flex">
     {error && <div className="text-red-500">Error in SIgnup</div>}  {!error && <div className="text-left w-full md:px-[200px] md:block hidden"> Let&apos;s go...</div>} 
     {!error && <h2 className="text-xl md:hidden w-full font-poppins h-20 mb-5 align-middle">{comment}</h2>}
        </div>
        <div className="flex-col flex w-[87%] md:w-1/2 justify-items-start items-start ">
          {/* <label htmlFor="name" className="text-xl my-3 font-normal ml-2">
            Username
          </label>
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={userName}
            onChange={(e) => {
              setUsername1(e.target.value);
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
          setUsername1(e.target.value); // Set the username
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
                selectComment(password);
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
            className="bg-[#1b1b1b] hover:bg-[#3f3f3f] transition-all duration-100 text-white ease text-xl py-4 md:px-6 mx-6 md:mx-0  rounded-lg"
            onClick={handleSignUp}
          >
            Sign Up
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
