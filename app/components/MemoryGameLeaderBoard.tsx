import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../(services)/firebase/config";

const MemoryGameLeaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [screenHeight, setScreenHeight] = useState<number>(0);

  useEffect(() => {
    // Only run this in the client
    if (typeof window !== 'undefined') {
      setScreenHeight(window.innerHeight);

      const handleResize = () => {
        setScreenHeight(window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const scoresSnapshot = await getDocs(
        query(collection(db, "memoryGameScores"), orderBy("score", "asc"), limit(5))
      );
      setLeaderboard(scoresSnapshot.docs.map(doc => doc.data()));
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center m-5">
      <div className={`md:flex hidden uppercase py-2 ${screenHeight > 770 ? "text-[3.0rem]" : "text-[2rem]"}`}>
        Leaderboard 🏆
      </div>
      <ul className="flex flex-col w-full items-center">
        <AnimatePresence>
          {leaderboard.map((entry, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`flex rounded-2xl font-poppins w-full ${screenHeight > 770 ? "text-[1.5rem]" : "text-[1rem]"} text-black `}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
                className={`hidden md:flex w-full items-center justify-between px-3 py-2 shadow-xl  hover:scale-110 transition-all duration-200 ${index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"}`}
              >
                <span className="flex justify-center items-center w-[50px] font-poppins">{index + 1}</span>
                <span className="flex-grow font-poppins min-w-[200px] text-center">{entry.username}</span>
                <span className="font-semibold w-[50px] text-center">{entry.score}s</span>
              </motion.div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default MemoryGameLeaderboard;
