// pages/index.tsx
"use client";
import React, { useEffect, useState } from "react";
import MemoryGame from "@/app/components/MemoryGame"; // Import the MemoryGame component
import { db } from "@/app/firebase/config";
import { useAuth } from "@/app/hooks/useAuth";
import Navbar from "@/app/components/Navbar";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, orderBy, limit } from "firebase/firestore";
import MemoryGameLeaderboard from "@/app/components/MemoryGameLeaderBoard";

const Home: React.FC = () => {
  const [memoryScore, setMemoryScore] = useState<number>(0);
  const [highscore, setHighscore] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>("Anonymous");
  const userRef = collection(db, "memoryGame"); // Updated collection for memory game
  const user = useAuth();

  useEffect(() => {
    const fetchHighscore = async () => {
      try {
        const querySnapshot = await getDocs(
          query(userRef, where("username", "==", currentUser))
        );
        if (!querySnapshot.empty) {
          setHighscore(querySnapshot.docs[0].data().highscore);
        }
      } catch (error) {
        console.error("Error fetching highscore:", error);
      }
    };

    if (user) {
      fetchHighscore();
      setCurrentUser(user.displayName);
    }
  }, [user, currentUser]);

  const handleMemoryScoreChange = async (score: number) => {
    setMemoryScore(score);
    if (score > highscore) {
      setHighscore(score);
      await updateHighscore(score, currentUser);
    }
  };

  const updateHighscore = async (newValue: number, passuser: string) => {
    const querySnapshot = await getDocs(
      query(userRef, where("username", "==", passuser))
    );

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await updateDoc(doc(userRef, docId), { highscore: newValue });
    } else {
      await addDoc(userRef, {
        highscore: newValue,
        username: passuser,
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-between w-full max-h-screen h-full md:p-10 transition-all">
      <Navbar />
      <div className="flex flex-col items-center w-full h-full justify-center transition-all">
        
        
        <div className="flex md:w-[80%] justify-between items-center mt-8">
      
          <MemoryGame onScoreChange={handleMemoryScoreChange} />
          <div>
          <div className="text-[4rem]">{currentUser}<MemoryGameLeaderboard /></div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Home;
