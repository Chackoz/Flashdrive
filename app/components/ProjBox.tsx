import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

function ProjBox() {
  const controls = useAnimation();

  useEffect(() => {
    controls.set({
      transform: `translateY(150px)`,
    });
  }, [controls]);

  return (
    <div
      className="w-full h-full  z-10 "
      onMouseOver={() =>
        controls.start({
          transform: `translateY(0px)`,
          transition: { duration: 0.7, ease: "easeInOut" },
        })
      }
      onMouseOut={() =>
        controls.start({
          transform: `translateY(150px)`,
          transition: { duration: 0.7, ease: "easeInOut" },
        })
      }
    >
      <div className="relative  flex justify-center items-center max-w-[590px] md:min-h-[720px]  bg-black rounded-[20px] overflow-hidden m-[10px] my-[20px]">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/flashdrive-6e8c3.appspot.com/o/art%20(11).png?alt=media&token=939b465c-bd94-4482-be4e-283f4fa0dad9"
          alt=""
          width={7000}
          height={720}
          className="-z-5 md:min-w-[590px] md:min-h-[720px] "
        ></Image>

        <div className="absolute h-[80px] overflow-hidden ">
          <motion.div
            animate={controls}
            className="text-white text-6xl text-center overflow-hidden"
          >
            <Marquee speed={200} className="overflow-hidden text-[4rem] font-poppins">
              - Stable Diffusion - View Project
            </Marquee>
          </motion.div>
        </div>
      </div>
      <div className="flex justify-between px-5 items-center">
        <div className="text-[2rem] font-semibold">Stable Diffusion</div>
        <div className="text-[1.5rem] font-light text-center">Web API</div>
      </div>
    </div>
  );
}

export default ProjBox;
