// Optimised
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

type ItemProps = {
  ImageUrl: string;
  header: string;
  desc: string;
  href: string;
};

const useProjBoxAnimation = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      transform: `translateY(150px)`,
    });
  }, [controls]);

  return controls;
};

function ProjBox(props: ItemProps) {
  const controls = useProjBoxAnimation();

  const handleMouseOver = () => {
    controls.start({
      transform: `translateY(0px)`,
      transition: { duration: 0.7, ease: "easeInOut" },
    });
  };

  const handleMouseOut = () => {
    controls.start({
      transform: `translateY(150px)`,
      transition: { duration: 0.7, ease: "easeInOut" },
    });
  };

  return (
    <a
      href={props.href}
      className="w-full h-full z-10 scale-90"
      onMouseOver={() => handleMouseOver()}
      onMouseOut={() => handleMouseOut()}
    >
      <div className="relative flex justify-center items-center max-w-[100%] md:max-h-[50%]  bg-black rounded-[20px] overflow-hidden m-[10px] my-[20px] ">
        {/* <Image
          src={props.ImageUrl}
          alt=""
          width={590}
          height={720}
          className="-z-5 md:min-w-[500px] md:min-h-[600px] "
        
        ></Image> */}
        <img src={props.ImageUrl} alt="" width={590} height={720} className="-z-5 md:min-w-[500px] md:min-h-[600px] "/>
        
        <div className="absolute h-[80px] overflow-hidden ">
          <motion.div
            animate={controls}
            className="text-white text-6xl text-center overflow-hidden"
          >
            <Marquee
              speed={200}
              className="overflow-hidden text-[4rem] font-poppins"
            >
              {props.header}&nbsp;- View Project -&nbsp;
            </Marquee>
          </motion.div>
        </div>
      </div>
      <div className="flex justify-between px-5 items-center">
        <div className="text-[2rem] font-semibold">{props.header}</div>
        <div className="text-[1.5rem] font-light text-center">{props.desc}</div>
      </div>
    </a>
  );
}

export default ProjBox;
