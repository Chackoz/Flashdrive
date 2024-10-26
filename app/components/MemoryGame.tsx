"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, addDoc, getDocs, query, orderBy, limit, updateDoc, where } from "firebase/firestore";
import { useAuth } from "../(services)/hooks/useAuth";
import { db } from "../(services)/firebase/config";

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onScoreChange: (score: number) => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onScoreChange }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);

  const user = useAuth();
  const userRef = collection(db, "memoryGameScores");

  const emojis: string[] = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵"];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && matchedPairs.length < cards.length / 2) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, matchedPairs.length, cards.length]);

  const initializeGame = (): void => {
    const numPairs = 8;
    const selectedEmojis = emojis.slice(0, numPairs);
    const gameCards: Card[] = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        content: emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(gameCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimer(0);
    setGameStarted(false);
  };

  const handleCardClick = (index: number): void => {
    if (isLocked) return;
    if (!gameStarted) setGameStarted(true);
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    if (matchedPairs.includes(cards[index].content)) return;

    setFlippedIndices((prev) => [...prev, index]);

    if (flippedIndices.length === 1) {
      setMoves((prev) => prev + 1);
      const firstCard = cards[flippedIndices[0]];
      const secondCard = cards[index];

      if (firstCard.content === secondCard.content) {
        setMatchedPairs((prev) => [...prev, firstCard.content]);
        setFlippedIndices([]);
        
        if (matchedPairs.length + 1 === cards.length / 2) {
          setTimeout(() => {
            onScoreChange(timer); // Pass the timer as the score
            setScore(timer);
            saveScoreToLeaderboard(timer);
          }, 500);
        }
      } else {
        setIsLocked(true);
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const saveScoreToLeaderboard = async (finalScore: number) => {
    if (!user) return;
    const querySnapshot = await getDocs(query(userRef, where("username", "==", user.displayName)));
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const currentHighscore = querySnapshot.docs[0].data().score;
      if (finalScore < currentHighscore) {
        await updateDoc(docRef, { score: finalScore });
      }
    } else {
      await addDoc(userRef, { username: user.displayName, score: finalScore });
    }
  };

  const gridSize = Math.ceil(Math.sqrt(cards.length));

  return (
    <div className="flex flex-col items-center bg-[#3d3d3d] p-12 rounded-xl shadow-xl">
      <div className="text-white mb-4">
        <div className="text-xl">Moves: {moves}</div>
        <div className="text-xl">Time: {timer}s</div>
      </div>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className={`w-16 h-16 md:w-32 md:h-32 rounded-xl cursor-pointer flex items-center justify-center text-2xl
              ${matchedPairs.includes(card.content)
                ? "bg-green-600" // Matched pairs turn green
                : flippedIndices.includes(index)
                ? "bg-yellow-500" // Flipped pairs turn yellow
                : "bg-[#1a1a1a]" // Initial state is a dark shade of black
              }
              transition-colors duration-300`}
            onClick={() => handleCardClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {(flippedIndices.includes(index) || matchedPairs.includes(card.content)) && card.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
