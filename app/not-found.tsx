"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {

    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <img src="/404.png" className="w-[300px] md:w-auto"></img>
      <h2 className="font-poppins text-[1.5rem] md:text-[3rem] tracking-tighter text-center md:p-0 px-5">
       404: I think you might be a little lost....
      </h2>
      <div className="flex md:flex-row flex-col gap-2 text-[1rem] font-medium ">
        <div className="p-1  text-lg md:text-[1.1rem] font-light">Why not visit our</div>

        <Link
         href="/"
          className="border-black border font-light rounded-full px-4 py-1 hover:bg-black hover:text-white text-center transition-all"
         
        >
          HOMEPAGE
        </Link>
      </div>
    </div>
  );
}
