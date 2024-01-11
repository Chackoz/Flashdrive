"use client";

import React, { useEffect, useState } from "react";
import convertTextToImage from "../utils/stablediffusion";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";

function Page() {
  const base64ToDataUrl = (
    base64String: string,
    mimeType: string = "image/png"
  ): string => {
    return `data:${mimeType};base64,${base64String}`;
  };

  const user = useAuth();
  // if(user) {
  //   console.log("Logged in as", user.displayName);
  // }
  if (!user) {
    console.log("Not logged in");
  }

  const [isConverting, setIsConverting] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string>(""); // Default text

  const [nsfwWarning, setWarning] = useState(false);

  const handleConvert = async () => {
    setIsConverting(true);
    setWarning(false);

    toast.loading("Creating Image");

    try {
      const imageData = await convertTextToImage(text);

      const base64Data = imageData;
      if (imageData === "") {
        setImageSrc("/images/duck.png");
        return;
      }
      const decodedData = base64ToDataUrl(base64Data);
      setImageSrc(decodedData);
      setError(null);
    } catch (err) {
      setError("Failed to convert text to image.");
      console.error(err);
    } finally {
      setIsConverting(false);

      //
      // NSFW HANDLIMG
      //

      const nsfwArray = [
        "nsfw",
        "rape",
        "raped",
        "retard",
        "retarded",
        "slut",
        "whore",
      ];

      for (let word of nsfwArray) {
        if (text.includes(word)) {
          setWarning(true);
          console.log("word in wordlist");
          break;
        }
        else{
          
        }
      }
      //
      //
      //
      //   GOOGLE PERSPECTIVE API FOR TOXICITY DETECTION IT SHOULD WORK IG......
      //
      //
      const API_ENDPOINT =
        "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyBBug83H1rEFVwbQgyIzJEbY4Q1q6eyDRg";

      console.log("Passed Text:", text);
      const requestBody = {
        comment: { text: text },
        requestedAttributes: { SEXUALLY_EXPLICIT: {} },
      };
      try {
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        console.log("API RESPONCE ", response);
        const data = await response.json();
        console.log("DATA RESPONCE", data);
        if (data.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value > 0.35) {
          console.log(
            `The text is toxic with a score of ${data.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value}`
          );
          setWarning(true);
        } else {
          console.log(
            `The text is not toxic with a score of ${data.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value}`
          );
        }
      } catch (error) {
        console.error("Error analyzing the text:", error);
      }

      if (nsfwWarning===true) {
        const userRef = collection(db, "nsfw-users");
        await addDoc(userRef, {
          username: user?.displayName || Date(),
          prompt: text,
          time: Date(),
        });
      }
      
      //
      // END OF API
      //
    }
  };
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleConvert();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleConvert]);

  useEffect(() => {
    handleConvert();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center w-full h-full min-h-screen md:p-0 pt-5">
      <Navbar />
      {isConverting && (
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "",
            duration: 3000,
            style: { background: "#363636", color: "#fff" },
          }}
        />
      )}
      {user && (
        <div className="flex md:flex-row flex-col md:w-[80%] w-full h-full justify-center items-center mx-auto">
          <div className="flex flex-col md:hidden md:w-[50%] w-full items-center justify-center p-5">
            {error && (
              <div className="md:text-[3rem] text-[1.5rem] text-black p-5">
                {" "}
                Sorry the server is currently
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
              <h3 className="flex w-full justify-center text-xl p-5">
                {nsfwWarning && (
                  <div className="text-red-500 text-2xl font-semibold text-center">
                    {" "}
                    NSFW Warning
                  </div>
                )}
              </h3>
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

          <div className="flex flex-col md:w-[90%] justify-center items-center ">
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
              className=" flex text-xl md:w-[600px] md:h-[150px] h-[100px] m-5 rounded-[10px] bg-[#cfcfcf]  text-center p-2 items-center justify-center border-black border-1"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the prompt for generation ( eg : 'a lovely riverside' "
            />
            <button
              onClick={handleConvert}
              className="bg-black px-5 p-2 text-white rounded-2xl text-[2rem] font-poppins hover:bg-[#e0e0e0] border-[1px] hover:border-black hover:text-black transition-all delay-75 duration-150"
            >
              {isConverting && <div className="animate-pulse">Generate</div>}
              {!isConverting && <div>Generate</div>}
            </button>
            <div className="font-light font-mono italic opacity-80 text-xs  text-center p-10">
              *We are using Google&apos;s Perspective AI to identify vulgar
              contents
            </div>
          </div>
          <div className="md:flex hidden w-[50%] items-center justify-center">
            <div>
              <h3 className="flex w-full justify-end text-xl p-5">
                {nsfwWarning && (
                  <div className="text-red-500 text-2xl font-semibold">
                    {" "}
                    NSFW Warning
                  </div>
                )}
              </h3>

              <div className="flex h-[512px] w-[512px] bg-black rounded-3xl justify-center items-center">
                {isConverting ? (
                  <div className="flex items-center justify-center h-full w-full">
                    <p className="text-white text-3xl animate-pulse">
                      Creating...
                    </p>
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
      {!user && (
        <div className="flex flex-col justify-center items-center w-full h-full text-6xl ">
          <img src="/images/gaurddog.png" />
          <div className="font-poppins p-5 text-center text-[3rem] md:text-[4rem]">
            Please Log in to use the web service
          </div>
          <a
            href="/login"
            className="text-[1.5rem] border-black border-[1px] rounded-full px-5 p-1"
          >
            Log In
          </a>
        </div>
      )}
    </main>
  );
}

export default Page;
