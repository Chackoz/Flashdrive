"use client";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { useFollowPointer } from "../utils/FollowPointer";
import { debounce } from "lodash";
import MusicPlayer from "../components/MusicPlayer";

function Page() {
  const ref = useRef(null);
  const { x, y } = useFollowPointer(ref);
  const [xd, setxd] = useState(0);
  const [yd, setyd] = useState(0);

  const debouncedX = debounce((value) => {
    setxd(x % 2000);
    console.log("Debounced x:", value);
  }, 16);

  const debouncedY = debounce((value) => {
    setyd(y % 1500);
    console.log("Debounced y:", value);
  }, 16);

  type Transition$1 =
    | {
        ease: string;
        type: string; // The type can be more specific if necessary
        damping: number;
        stiffness: number;
        restDelta: number;
      }
    | undefined;

  debouncedX(x);
  debouncedY(y);

  return (
    <motion.main
      className="flex flex-col w-full h-full min-h-screen font-poppins    bg-[#e0e0e0]  text-black  transition-all duration-200 z-[1]"
      ref={ref}
      animate={{ x: 0, y: 0 }}
      transition={
        {
          ease: "easein",
          type: "spring",
          damping: 10,
          stiffness: 45,
          restDelta: 0.0001,
        } as Transition$1
      }
    >
       <motion.div
        className="opacity-[60%]"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
        animate={{ x: xd, y: yd, top: 0, left: 0 }}
        transition={
          {
            type: "spring",
            damping: 10,
            stiffness: 80,
            restDelta: 0.01,
          } as Transition$1
        }
      >
        <div className="w-[200px] h-[200px] bg-white"></div>
      </motion.div>

      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
        animate={{ x: xd, y: yd, top: 0, left: 0 }}
        transition={
          {
            type: "spring",
            damping: 10,
            stiffness: 90,
            restDelta: 0.01,
          } as Transition$1
        }
      >
        <MusicPlayer />
      </motion.div>
     
    </motion.main>
  );
}

export default Page;
