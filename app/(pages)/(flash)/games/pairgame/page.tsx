// Pair Game
"use client";
import React, { useEffect, useState } from "react";
import MemoryGame from "@/app/components/MemoryGame";
import Navbar from "@/app/components/Navbar";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import MemoryGameLeaderboard from "@/app/components/MemoryGameLeaderBoard";
import { db } from "@/app/(services)/firebase/config";
import { useAuth } from "@/app/(services)/hooks/useAuth";
import GameOverModal from "@/app/components/GameOverModal";

const Home: React.FC = () => {
  const [memoryScore, setMemoryScore] = useState<number>(0);
  const [highscore, setHighscore] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>("Anonymous");
  const [isGameOver, setIsGameOver] = useState(false);
  const userRef = collection(db, "memoryGame");
  const scoresRef = collection(db, "memoryGameScores");
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

  const handleMemoryScoreChange = async (score: number, gameOver: boolean = false) => {
    setMemoryScore(score);
    if (gameOver) {
      setIsGameOver(true);
      if (score > highscore) {
        setHighscore(score);
        await updateHighscore(score, currentUser);
        await updateLeaderboard(score, currentUser);
      }
    }
  };

  const handlePlayAgain = () => {
    setIsGameOver(false);
    setMemoryScore(0);
    // You'll need to add a reset method to your MemoryGame component
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

  const updateLeaderboard = async (newScore: number, username: string) => {
    const querySnapshot = await getDocs(query(scoresRef, where("username", "==", username)));
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await updateDoc(doc(scoresRef, docId), { score: newScore });
    } else {
      await addDoc(scoresRef, { username, score: newScore });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-between w-full max-h-screen h-full md:p-10 transition-all">
      <Navbar />
      <div className="flex flex-col items-center w-full h-full justify-center transition-all">
        <div className="flex md:flex-row flex-col md:w-[90%] justify-between items-center mt-8">
          <div>
            <div className="text-2xl mb-4">
              <div className="text-3xl font-semibold">{currentUser}</div>
              Current Score: <span className="font-bold">{memoryScore}</span>
            </div>
            <MemoryGame onScoreChange={handleMemoryScoreChange} />
          </div>
          <div className="flex md:flex-row flex-col w-full h-full justify-center items-center transition-all ease-linear">
            <div className="text-[4rem]"><MemoryGameLeaderboard /></div>
          </div>
        </div>
      </div>

      <GameOverModal
        isOpen={isGameOver}
        onClose={handlePlayAgain}
        score={memoryScore}
        highscore={highscore}
        isNewHighscore={memoryScore > highscore}
      />
    </div>
  );
};

export default Home;