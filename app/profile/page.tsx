"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { FaUserAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { FaUserPen } from "react-icons/fa6";
import Modal from "../components/Modal";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
const userRef = collection(db, "user");
const scoreRef = collection(db, "snake");


const Page = () => {
  const user = useAuth();
  const [modal, setModal] = useState(false);
  const [ifpfp, setIfpfp] = useState(false);
  const [imgurl, setimgurl] = useState(0);
  const [highscore, setHighscore] = useState(0);

  const fetchHighscore = async () => {
    try {
      let currentUser = "";
      if (user) {
        currentUser = user.displayName || "";
      }
      console.log("Current User :", currentUser);
      const querySnapshot = await getDocs(
        query(scoreRef, where("username", "==", currentUser))
      );
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        console.log("Fetched Highscore:", docData.highscore); // Log to see if data is fetched
        setHighscore(docData.highscore);
      } else {
        console.log("No highscore found for user:", currentUser);
      }
    } catch (error) {
      console.error("Error fetching highscore:", error);
    }
  };

  const Getpfp = async () => {
    try {
      let currentUser = "";
      if (user) {
        currentUser = user.displayName || "";
      }
      console.log("Current User :", currentUser);
      const querySnapshot = await getDocs(
        query(userRef, where("username", "==", currentUser))
      );
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        console.log("Fetched PFP:", docData.pfp);
        setimgurl(docData.pfp); // Log to see if data is fetched
        setIfpfp(true);
      } else {
        console.log("No PFP found for user:", currentUser);
        setIfpfp(false);
      }
    } catch (error) {
      console.error("Error fetching pfp:", error);
    }
    fetchHighscore();
  };

  Getpfp();
  

  const Setpfp = async (newValue: number) => {
    try {
      let currentUser = "";
      if (user) {
        currentUser = user.displayName || "";
      }
      console.log("Current User :", currentUser);
      const querySnapshot = await getDocs(
        query(userRef, where("username", "==", currentUser))
      );
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;

        await updateDoc(doc(userRef, docId), {
          pfp: newValue,
        });
      } else {
      }
    } catch (error) {
      console.error("Error fetching highscore:", error);
    }
    Getpfp();
  };

  const handleImageSelect = async (num: number | null) => {
    console.log("Selected Image no is " + num);
    if (num) Setpfp(num);
    Getpfp();
    setModal(false);
  };

  return (
    <main
      className={` flex flex-col items-center justify-center w-full h-full relative min-h-screen md:p-0 pt-5 `}
    >
      {modal && (
        <div className="h-screen w-screen  z-20 flex flex-col justify-center items-center absolute">
          <div className=" flex flex-col  items-end px-7">
            <div
              onClick={() => setModal(!modal)}
              className="cursor-pointer mb-5"
            >
              {" "}
              <AiOutlineClose size="2rem" />
            </div>
            <Modal onSelectImage={handleImageSelect}></Modal>
          </div>
        </div>
      )}
      <Navbar></Navbar>
      {user && (
        <div
          className={`  ${
            modal ? "blur" : ""
          } flex bg-red w-[80%] h-full items-center justify-center `}
        >
          <div className="w-[80%] gap-4  flex  justify-between">
            <div
              onClick={() => setModal(!modal)}
              className="bento flex justify-center group items-center cursor-pointer"
            >
              <div className=" flex w-full h-full group-hover:scale-150  justify-center items-center transition-all ease duration-100 ">
                {!ifpfp && (
                  <FaUserPen size="3rem" color="gray" className="opacity-55" />
                )}
                {ifpfp && (
                  <img
                    src={`https://firebasestorage.googleapis.com/v0/b/flashdrive-6e8c3.appspot.com/o/pfp%2Fpfp%20(${imgurl}).png?alt=media&token=6f312ab2-f540-4379-9b9c-fba7f0848d60`}
                  />
                )}
              </div>
            </div>
            <div className="bento w-[80%] flex flex-col justify-center items-center">
              {user && (
                <div className="text-7xl font-logo">{user.displayName}</div>
                
              )}
              {user && (
                <div className="text-2xl font-poppins text-start">{user.email}</div>
              )}
            </div>
            <div className="bento flex justify-around items-center flex-col">
              <div className="text-center">High Score</div>
              <div className="font-logo text-5xl">{highscore}</div>
            </div>
          </div>
        </div>
      )}

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
  );
};

export default Page;
