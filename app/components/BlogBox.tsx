import React from "react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { BsGithub, BsTwitterX } from "react-icons/bs";
import Image from "next/image";

interface TeamBoxProps {
  name: string;
  imgurl: string;
  githuburl: string;
  desc: string;
}

function BlogBox(props: TeamBoxProps) {
  return (
    <div className="flex flex-col w-fit h-fit items-start justify-start gap-2 overflow-hidden md:max-w-[500px] max-w-[85vw] rounded-lg m-5">
      <Image
        width={350}
        height={350}
        src={props.imgurl}
        alt="Image"
        className="h-full w-full object-cover md:w-[450px] md:h-[450px] my-4 object-cover"
      />

      <div className="flex flex-col justify-between md:min-h-[200px] h-fit gap-2 md:gap-0">
        <h1 className="font-poppins2 md:text-5xl  text-4xl">{props.name}</h1>
        <h2 className="font-poppins md:text-2xl text-xl text-[#646464]">
          {props.desc}
        </h2>
        <a
          href={props.githuburl}
          className="px-4 border-[#3d3d3d] border-[1px] w-fit rounded-full text-[#3d3d3d] text-xl hover:bg-[#3d3d3d] hover:text-white transition-all"
        >
          Github
        </a>
      </div>
    </div>
  );
}

export default BlogBox;
