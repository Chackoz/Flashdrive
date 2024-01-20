"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
const LoadingScreen: React.FC = () => {

  
  const colors = ["#1b1b1b", "#1b1b1b", "#1b1b1b", "#1b1b1b", "#1b1b1b"];

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const dotVariants = {
    initial: {},
    animate: {
      height: [40, 100, 40],
      transition: {
        repeat: Infinity,
      },
    },
  };
  let count = 5 ;

  return <div className="w-full h-full flex justify-center items-center">
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      style={{
        display: "flex",
        gap: 16,
        height: 100,
        alignItems: "center"
      }}
    >
      {Array(count)
        .fill(null)
        .map((_, index) => {
          return (
            <motion.div
              key={index}
              variants={dotVariants}
              style={{
                height: 40,
                width: 40,
                backgroundColor: colors[index % colors.length],
                borderRadius: 20
              }}
            />
          );
        })}
    </motion.div>
  </div>;
};

export default LoadingScreen;
