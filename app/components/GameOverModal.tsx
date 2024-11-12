// components/GameOverModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsTrophy } from 'react-icons/bs';


const GameOverModal = ({ 
  isOpen, 
  onClose, 
  score, 
  highscore, 
  isNewHighscore 
}: { 
  isOpen: boolean;
  onClose: () => void;
  score: number;
  highscore: number;
  isNewHighscore: boolean;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-8 max-w-md w-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {isNewHighscore && <BsTrophy className="text-yellow-500" />}
                Game Over!
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-lg">
                Your Score: <span className="font-bold text-primary">{score}</span>
              </div>
            </div>
            <div className="mt-6">
              <button
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90"
                onClick={onClose}
              >
                Play Again
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameOverModal;