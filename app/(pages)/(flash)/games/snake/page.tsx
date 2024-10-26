"use client";
import SnakeGame from "@/app/components/SnakeGame";


import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  orderBy,
  limit,
} from "firebase/firestore";

import Navbar from "@/app/components/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/app/(services)/hooks/useAuth";
import { db } from "@/app/(services)/firebase/config";

let displayName = "Anonymous";

const Home: React.FC = () => {
  const [variable, setVariable] = useState<number>(0);
  const [highscore, setHighscore] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>("Anonymous");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userRef = collection(db, "snake");
  const user = useAuth();
  const [screenWidth, setScreenWidth] = useState<number>(800);
  const [screenHeight, setScreenHeight] = useState<number>(800);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {};
  });

  const fetchLeaderboard = async () => {
    try {
      const leaderboardSnapshot = await getDocs(
        query(userRef, orderBy("highscore", "desc"), limit(5))
      );
      const leaderboardData = leaderboardSnapshot.docs.map((doc) => doc.data());
      return leaderboardData;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
  };

  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const handleVariableChange = async (newValue: number) => {
    setVariable(newValue);
  };

  const fetchHighscore = async () => {
    try {
      const querySnapshot = await getDocs(
        query(userRef, where("username", "==", currentUser))
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
  useEffect(() => {
    if (user && variable >= highscore) {
      fetchHighscore();
    }
    const loadLeaderboard = async () => {
      const leaderboardData = await fetchLeaderboard();
      setLeaderboard(leaderboardData);
    };
    loadLeaderboard();
  }, [user, currentUser, highscore]);

  const updatehighscore = async (newValue: number, passuser: string) => {
    const querySnapshot = await getDocs(
      query(userRef, where("username", "==", passuser))
    );

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      if (newValue > 0) {
        await updateDoc(doc(userRef, docId), {
          highscore: newValue,
        });
      }
    } else {
      // Add a new document
      const querySnapshot = await getDocs(
        query(userRef, where("username", "==", passuser))
      );
      if (querySnapshot.empty) {
        if(highscore>0){
        await addDoc(userRef, {
          highscore: newValue,
          username: currentUser,
        });
      }
      }
    }
  };

  useEffect(() => {
    if (user) {
      if (variable >= highscore) {
        setHighscore(variable);
        updatehighscore(variable, currentUser);
      }

      displayName = currentUser;
      setCurrentUser(user.displayName);

      setIsLoading(false);
    } else {
      if (variable >= highscore) {
        console.log("test");
        setHighscore(variable);
      }

      displayName = currentUser;
    }
  });

  return (
    <div className="relative flex flex-col justify-between w-full max-h-screen h-full md:p-10 transition-all">
      <div className={`${screenHeight > 770 ? "mt-0" : "mt-10"} justify-start items-start mt-auto`}>
        <Navbar />
      </div>
      <div className={`flex md:flex-row flex-col  w-full h-full justify-center items-center transition-all ease-linear ${screenHeight > 770 ? "" : "scale-[80%]"}`}>
        <div className="flex h-full flex-col md:w-[50%]  justify-center items-start  order-1 md:order-1 px-[50px]">
          <div className=" font-poppins">
            <div className="text-[4rem]">{currentUser}</div>
            <div className="text-[3rem] text-[#2d2d2d]">
              {" "}
              Current Score : <span className="text-green-800">{variable}</span>
            </div>

            {currentUser === "Anonymous" ? (
              <a
                href="/login"
                className="text-[3rem] text-[#f08181] hover:text-[#ff7373] hover:scale-[110%]"
              >
                Log in to view highscore
              </a>
            ) : (
              <div className="">
                <div className="text-[3rem] text-[#2d2d2d]">
                  High Score :
                  <span className="text-green-800">{highscore}</span>
                </div>
                <div
                  className={` text-[3rem] text-[#2d2d2d] mt-8 transition-all delay-75 duration-200 my-10  rounded-2xl hidden  md:flex flex-col order-0 `}
                >
                  <div
                    className={` uppercase py-2 ${
                      screenHeight > 770 ? "text-[3.0rem]" : "text-[2rem]"
                    }`}
                  >
                    Leaderboard 🏆
                  </div>
                  <ul className="flex flex-col">
                    <AnimatePresence>
                      {leaderboard.map((leader, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          className={`flex rounded-2xl font-poppins ${
                            screenHeight > 770 ? "text-[1.5rem]" : "text-[1rem]"
                          }  text-black`}
                        >
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 * index, duration: 0.5 }}
                            className={`flex w-full  ${
                              screenHeight > 770 ? "min-w-[39%]" : "w-[280px]"
                            } justify-between hover:scale-110 transition-all duration-200 px-3 shadow-xl ${
                              index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"
                            }`}
                          >
                            <td className="flex  w-[50px] font-poppins items-center text-center ">
                              {index + 1}
                            </td>
                            <td className="font-poppins min-w-[200px] items-center py-2">
                              {leader.username}
                            </td>
                            <td className=" font-semibold w-[50px] py-2">
                              {leader.highscore}
                            </td>
                          </motion.div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className=""> </div>
        </div>
        <div className="flex md:w-[60%] order-0 md:order-2 items-center justify-center m-5">
          <SnakeGame onValueChange={handleVariableChange} />
        </div>
      </div>
   
    </div>
  );
};

export default Home;
