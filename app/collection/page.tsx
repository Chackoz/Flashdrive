"use client";
import React from "react";
import Masonry from "react-masonry-css";
import Navbar from "../components/Navbar";
import NavDar from "../components/NavDar";
import Image from "next/image";

function page() {
  const images = Array.from({ length: 125 }, (_, i) => i + 1);
  const breakpointColumnsObj = {
    default: 6,
    1100: 5,
    700: 4,
    500: 2,
  };

  const shuffleArray = (array: number[]): number[] => {
    // Specify the type for the array parameter
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledImages = shuffleArray([...images]);

  return (
    <main className="realtive flex flex-col w-full h-full p-5 items-center ">
      <Navbar />

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid m-5 k "
        columnClassName="my-masonry-grid_column"
      >
        {shuffledImages.map((index) => (
          // eslint-disable-next-line react/jsx-no-undef
          <Image
            className="h-auto max-w-full rounded-lg m-4  "
            src={`https://firebasestorage.googleapis.com/v0/b/flashdrive-6e8c3.appspot.com/o/art%20(${index}).png?alt=media&token=939b465c-bd94-4482-be4e-283f4fa0dad9`}
            alt={`Image ${index}`}
            key={index}
            width={512}
            height={512}
            layout="responsive"
            loading="lazy" // Enable lazy loading
        
            ></Image>
        ))}
      </Masonry>

      <div className="items-end  text-black text-[4rem] flex justify-center  w-full min-h-[1000px] bg-gradient-to-t from-[#bbf7d0] via-[#bbf7d0] to-tranparent -translate-y-[1000px]">
        <div className="m-10 -translate-y-10">
        Coming Soon..
        </div>
      </div>
    </main>
  );
}

export default page;
