// pages/index.tsx
"use client";
import SnakeGame from "@/app/components/SnakeGame";

import { db } from "@/app/firebase/config";

import { useAuth } from "@/app/hooks/useAuth";
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

let displayName = "Anonymous";

const Home: React.FC = () => {
  const [variable, setVariable] = useState<number>(0);
  const [highscore, setHighscore] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>("Anonymous");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userRef = collection(db, "snake");
  const user = useAuth();

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
        await addDoc(userRef, {
          highscore: newValue,
          username: currentUser,
        });
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
    <div className="relative flex flex-col justify-between w-full min-h-screen md:p-10">
      <div className="">
        <Navbar />
      </div>
      <div className="flex md:flex-row flex-col  w-full h-full justify-center items-center transition-all ease-linear ">
        <div className="flex h-full flex-col md:w-[30%]  justify-start items-start  order-1 md:order-0">
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
               
              </div>
            )}
          </div>
          <div className=""> </div>
        </div>
        <div className="flex md:w-[50%] order-0 md:order-1 items-center justify-center">
          <SnakeGame onValueChange={handleVariableChange} />
          
        </div>
        <div className="w-[33%] text-[3rem] text-[#2d2d2d] mt-8 transition-all delay-75 duration-200 my-10  rounded-2xl hidden md:flex flex-col order-2 m-10">
                  <div className="text-[3.5rem] uppercase py-2 ">
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
                          className="flex rounded-2xl font-poppins text-[1.4rem]  text-black"
                        >
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 * index, duration: 0.5 }}
                            className={`flex w-full min-w-[500px] justify-between hover:scale-110 transition-all duration-200 px-3 shadow-xl ${
                              index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"
                            }`}
                          >
                            <td className="flex text-[3rem] w-[50px] font-poppins items-center text-center ">
                              {index + 1}
                            </td>
                            <td className="text-[2rem] font-poppins min-w-[250px] items-center py-2">
                              {leader.username}
                            </td>
                            <td className="text-[2rem] font-semibold w-[50px] py-2">
                              {leader.highscore}
                            </td>
                          </motion.div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
      </div>
      <footer className="flex w-full justify-center items-center font-poppins text-[2rem] pb-10">
        Copyright @ F^2 AN
      </footer>
    </div>
  );
};

export default Home;
