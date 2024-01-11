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
import { LazyMotion, domAnimation, motion } from "framer-motion";
import Masonry from "react-masonry-css";
import LazyLoad from "react-lazy-load";
import Image from "next/image";

let breakpointColumnsObj = {
  default: 6,
  1100: 5,
  700: 4,
  500: 2,
};
const userRef = collection(db, "user");
const scoreRef = collection(db, "snake");
const imgRef = collection(db, "images");
const Page = () => {
  const user = useAuth();
  const [modal, setModal] = useState(false);
  const [ifpfp, setIfpfp] = useState(false);
  const [imgurl, setimgurl] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const[result,setResult]=useState(0);
  const [imgCount, setImgCount] = useState(0);
  const [images, setImages] = useState<number[]>([]);
  const insertNumber = (number: number) => {
    // Check if the number already exists in the images array
    if (!images.includes(number)) {
      setImages((prevImages) => [...prevImages, number]);
    } else {
      console.log(`Number ${number} already exists in the list.`);
    }
  };
  const imgc = 200;

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

  const fetchImages = async () => {
    let currentUser = "";
    if (user) {
      currentUser = user.email || "";
    }
    const querySnapshot = await getDocs(
      query(imgRef, where("email", "==", currentUser))
    );
    

    if (querySnapshot.size > 6) {
      setResult(8)
    } else {
      setResult(querySnapshot.size+2);
    }
    breakpointColumnsObj = {
      default: result,
      1100: 5,
      700: 4,
      500: 2,
    };
    if (!querySnapshot.empty) {
      setImgCount(querySnapshot.size);
      console.log("imgCount", imgCount);
      for (let i = 0; i <= imgCount - 1; i++) {
        const docData = querySnapshot.docs[i].data();
        if (docData) {
          if (!images.includes(docData.imgno)) {
            insertNumber(docData.imgno);
          }
        }
      }
    } else {
      // Add a new document
    }
    console.log("Images : ", images);
  };

  const Getpfp = async () => {
    try {
      let currentUser = "";
      if (user) {
        currentUser = user.email || "";
      }
      console.log("Current User :", currentUser);
      const querySnapshot = await getDocs(
        query(userRef, where("email", "==", currentUser))
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
    fetchImages();
  };

  Getpfp();

  const Setpfp = async (newValue: number) => {
    try {
      let currentUser = "";
      if (user) {
        currentUser = user.email || "";
      }
      console.log("Current User :", currentUser);
      const querySnapshot = await getDocs(
        query(userRef, where("email", "==", currentUser))
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
          } flex md:flex-row flex-col bg-red w-[80%] h-full items-center justify-center `}
        >
          <div className="w-[80%] gap-4  flex  justify-between md:flex-row flex-col">
            <div
              onClick={() => setModal(!modal)}
              className="md:bento flex justify-center group items-center cursor-pointer"
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
            <div className="md:bento md:w-[80%] flex flex-col justify-center items-center">
              {user && (
                <div className="md:text-7xl text-4xl font-logo">
                  {user.displayName}
                </div>
              )}
              {user && (
                <div className="md:text-2xl text-lg font-poppins text-start">
                  {user.email}
                </div>
              )}
            </div>
            <div className="md:bento flex justify-center items-center flex-col">
              <div className="text-center text-3xl md:text-5xl">High Score</div>
              <div className="font-logo md:text-5xl text-2xl">{highscore}</div>
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

      <div className="flex w-[80%] h-full mx-auto">
        <LazyMotion features={domAnimation}>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {images.slice(0, imgCount).map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ease: "easeInOut", duration: 0.5 }}
                className="relative rounded-lg overflow-hidden bg-green-300"
              >
                <LazyLoad offset={400}>
                  <Image
                    className="object-cover w-full h-full bg-[#d5d5d5]  hover:scale-110 transition-all "
                    src={`https://firebasestorage.googleapis.com/v0/b/flashdrive-6e8c3.appspot.com/o/art%20(${
                      index % imgc == 0 ? (index % imgc) + 1 : index % imgc
                    }).png?alt=media&token=939b465c-bd94-4482-be4e-283f4fa0dad9`}
                    alt={`Image ${
                      index % 125 == 0 ? (index % 125) + 1 : index % 125
                    }`}
                    width={512}
                    height={512}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={`https://firebasestorage.googleapis.com/v0/b/flashdrive-6e8c3.appspot.com/o/art%20(${
                      index % imgc == 0 ? (index % imgc) + 1 : index % imgc
                    }).png?alt=media&token=939b465c-bd94-4482-be4e-283f4fa0dad9`}
                  />
                </LazyLoad>
              </motion.div>
            ))}
          </Masonry>
        </LazyMotion>
      </div>
    </main>
  );
};

export default Page;
