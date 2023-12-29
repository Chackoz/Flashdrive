// pages/index.tsx
"use client";
import SnakeGame from "@/app/components/SnakeGame";

import { db } from "@/app/firebase/config";

import { useAuth } from "@/app/hooks/useAuth";
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

let displayName = "Anonymous";

const Home: React.FC = () => {
  const [variable, setVariable] = useState<number>(0);
  const [highscore, setHighscore] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>("Anonymous");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userRef = collection(db, "snake");
  const user = useAuth();

  const handleVariableChange = async (newValue: number) => {
    setVariable(newValue);
    if (newValue > highscore) {
      setHighscore(newValue);

      const querySnapshot = await getDocs(
        query(userRef, where("username", "==", currentUser))
      );

      if (!querySnapshot.empty) {
        // Update the existing document

        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(userRef, docId), {
          highscore: newValue,
        });
      } else {
        // Add a new document
        await addDoc(userRef, {
          highscore: newValue,
          username: currentUser,
        });
      }
    }
  };
  useEffect(() => {
    const fetchHighscore = async () => {
      try {
        const querySnapshot = await getDocs(
          query(userRef, where("username", "==", currentUser))
        );

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          console.log("Fetched Highscore:", docData.highscore); // Log to see if data is fetched
          setHighscore(docData.highscore);
        } else {
          console.log("No highscore found for user:", currentUser);
          query(userRef, where("username", "==", "Anonymous"));
          const docData = querySnapshot.docs[0].data();
          setHighscore(docData.highscore);
        }
      } catch (error) {
        console.error("Error fetching highscore:", error);
      }
    };
    const fetchAnonscore = async () => {
      try {
        const querySnapshot = await getDocs(
          query(userRef, where("username", "==", "Anonymous"))
        );

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          console.log("Fetched Highscore:", docData.highscore); // Log to see if data is fetched
          setHighscore(docData.highscore);
        } else {
          console.log("Error");
        }
      } catch (error) {
        console.error("Error fetching highscore:", error);
      }
    };

    if (user && currentUser) {
      fetchHighscore();
    } else {
      fetchAnonscore();
    }
  }, [user, currentUser,highscore]);

  useEffect(() => {
    console.log("Variable:", variable);
    console.log("Highscore:", highscore);

    if (user) {
      if (variable >= highscore) {
        console.log("test");
        setHighscore(variable);
      }

      displayName = currentUser;
      console.log(`User Email: ${user.email}`);
      console.log(`User ID: ${user.uid}`);
      console.log(`User Name", ${user.displayName}`);
      setCurrentUser(user.displayName);
      setIsLoading(false);
    } else {
      if (variable >= highscore) {
        console.log("test");
        setHighscore(variable);
      }

      displayName = currentUser;
    }
  }, [user]);

  return (
    <div className="flex md:flex-row flex-col w-full min-h-screen  justify-center items-center transition-all ease-linear ">
      <div className="flex h-full flex-col md:w-[50%] justify-start items-start md:p-10 order-1 md:order-0">
        <div className=" font-poppins">
          <div className="text-[4rem]">{currentUser}</div>
          <div className="text-[3rem] text-[#2d2d2d]">
            {" "}
            Current Score : <span className="text-green-800">{variable}</span>
          </div>
          <div className="text-[3rem] text-[#2d2d2d]">
            {" "}
            High Score : <span className="text-green-800">{highscore}</span>
          </div>
        </div>
        <div className=""> </div>
      </div>
      <div className="flex md:w-[50%] order-0 md:order-1 items-center justify-center">
        <SnakeGame onValueChange={handleVariableChange} />
      </div>
    </div>
  );
};

export default Home;
