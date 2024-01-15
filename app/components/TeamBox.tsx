import React from 'react'
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { BsGithub, BsTwitterX } from "react-icons/bs";

interface TeamBoxProps {
  name : string;
  imgurl:string;
  githuburl:string;
  linkedinurl:string;
}

function TeamBox (props: TeamBoxProps) { 
  return (
    <div className='flex flex-col w-[270px] h-[470px] items-center justify-around bg-[#f1f1f1] rounded-2xl m-5 '>
        <div className='flex w-[220px] h-[340px] bg-blue-400 rounded-xl mt-2 justify-center overflow-hidden items-center '>
          <img src={props.imgurl} alt="Image" className='h-full w-full object-cover' />
          </div>
        <div className='flex w-[240px] items-center h-[80px]'>
            <div className='flex flex-col justify-between w-[200px] h-[80px]'>
                <div className='flex w-[190px] h-[50px] text-2xl'><span className='font-semibold'>{props.name}</span></div>
                <div className='flex w-[190px] h-[50px] text-lg'>S5 CS1</div>
            </div>
            <div className=' flex w-full gap-2 justify-end items-center h-[50px]'>
              <a href={props.linkedinurl}>
                 <FaLinkedin size="25" color="#2a2a2a"/>
              </a>
              <a href={props.githuburl}>
                 <BsGithub size="25" color="#2a2a2a"/>
              </a>
            </div>
        </div>
    </div>
  )
}

export default TeamBox;
