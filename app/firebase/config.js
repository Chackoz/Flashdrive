import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth} from "firebase/auth"
import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

import { getDatabase } from "firebase/database";
import { useState } from "react";



const firebaseConfig = {
  apiKey: "AIzaSyCvdkLZEyeFkYtnngqQ7xpPsaoUMFTMj1g",
  authDomain: "flashdrive-6e8c3.firebaseapp.com",
  projectId: "flashdrive-6e8c3",
  storageBucket: "flashdrive-6e8c3.appspot.com",
  messagingSenderId: "221849897334",
  appId: "1:221849897334:web:fe47cafd9f159f6d249257",
  measurementId: "G-69M1W03HZR"
};

// Initialize Firebase
const app =!getApps.length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
console.log("AUth data", auth)
// const analytics = getAnalytics(app);
const db = getFirestore(app)
const database=getDatabase();
let val1=0;
let val2="";

const FetchValue = async (path) => {


  try {
    // Fetch the current value from the database
    const numberDoc = collection(db, "imgCount");
    const docSnapshot = await getDocs(numberDoc);
    const val = docSnapshot.docs[0].data().imgCount;
    val1=val;
  } catch (error) {
    console.error("Error updating value:", error);
    throw error;
  }

  return val1;
};
const FetchAPi = async (path) => {

  try {
    // Fetch the current value from the database
    const numberDoc = collection(db, "api");
    const docSnapshot = await getDocs(numberDoc);
    const val = docSnapshot.docs[0].data().api;
    val2=val;
  } catch (error) {
    console.error("Error updating value:", error);
    throw error;
  }

  return val2;
};


const UpdateValue =async(number)=>{
  const numberDoc = doc(db, "imgCount", "MwgsCuWhuN7zElYo8ddi");
 
  await updateDoc(numberDoc, {
    imgCount: number
  });
}

export {app,auth,db,FetchValue,UpdateValue,FetchAPi}