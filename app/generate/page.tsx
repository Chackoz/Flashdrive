"use client";

import React, { useEffect, useState } from "react";
import convertTextToImage from "../utils/stablediffusion";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

function Page() {
  const base64ToDataUrl = (
    base64String: string,
    mimeType: string = "image/png"
  ): string => {
    return `data:${mimeType};base64,${base64String}`;
  };

  const user = useAuth();
  if (!user) {
    console.log("Not logged in");
  }

  const [isConverting, setIsConverting] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string>(""); // Default text
  const handleConvert = async () => {
    setIsConverting(true);
    try {
      const imageData = await convertTextToImage(text);
      const base64Data = imageData;
      const decodedData = base64ToDataUrl(base64Data);
      setImageSrc(decodedData);
      setError(null);
    } catch (err) {
      setError("Failed to convert text to image.");
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };
  useEffect(() => {
    handleConvert();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center w-full h-full min-h-screen md:p-0 pt-5">
      <Navbar />

      {user && (
        <div className="flex md:flex-row flex-col md:w-[80%] w-full h-full justify-center items-center mx-auto">
          <div className="flex flex-col md:hidden md:w-[50%] w-full items-center justify-center p-5">
            {error && (
              <div className="md:text-[3rem] text-[1.5rem] text-black p-5">
                {" "}
                Sorry the server is currenlty
                <span className="text-red-700"> Offline</span>
              </div>
            )}
            {!error && (
              <div className="md:text-[3rem] text-[1.5rem] text-black p-5">
                {" "}
                Let your dreams meet{" "}
                <span className="text-green-700"> Reality</span>
              </div>
            )}

            <div>
              <h3>Converted Image:</h3>
              <div className="flex h-[256px] w-[256px] bg-black rounded-3xl">
                {isConverting ? (
                  <div className="flex items-center justify-center h-full w-full">
                    <p className="text-white text-3xl">Creating...</p>
                  </div>
                ) : (
                  imageSrc && (
                    <img
                      src={imageSrc}
                      alt="Converted"
                      className="rounded-3xl h-[256px] w-[256px]"
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:w-[50%] justify-center items-center ">
            {error && (
              <div className="md:flex hidden text-[3rem] text-black ">
                Sorry the server is currently-
                <span className="text-red-700">Offline</span>
              </div>
            )}
            {!error && (
              <div className="md:flex hidden text-[3rem] text-black p-5">
                Let your dreams meet -
                <span className="text-green-700">Reality</span>
              </div>
            )}
            <textarea
              className=" flex text-xl md:w-[500px] h-[100px] m-5 rounded-[10px] bg-[#cfcfcf]  text-center p-2 items-center justify-center border-black border-1"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the prompt for generation"
            />
            <button
              onClick={handleConvert}
              className="bg-black px-5 p-2 text-white rounded-lg text-[2rem]"
            >
              Generate
            </button>
          </div>
          <div className="md:flex hidden w-[50%] items-center justify-center">
            <div>
              <h3>Converted Image:</h3>
              <div className="flex h-[512px] w-[512px] bg-black rounded-3xl">
                {isConverting ? (
                  <div className="flex items-center justify-center h-full w-full">
                    <p className="text-white text-3xl">Creating...</p>
                  </div>
                ) : (
                  imageSrc && (
                    <img
                      src={imageSrc}
                      alt="Converted"
                      className="rounded-3xl"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {!user &&
     
      <div className="flex flex-col justify-center items-center w-full h-full text-6xl ">
         <img src="/images/gaurddog.png"/>
         <div className="font-poppins p-5 text-center text-[3rem] md:text-[4rem]">Please Log In to use the web service</div>
         <a href='/login' className="text-[1.5rem] border-black border-[1px] rounded-full px-5 p-1">Log In</a>
         </div>}
    </main>
  );
}

export default Page;
