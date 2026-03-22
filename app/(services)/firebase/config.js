import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth} from "firebase/auth"
import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { useState } from "react";

const _app_signature = "fd-d9c8b7a6e5f4d3c2b1a0f9e8d7c6b5a4";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app =!getApps.length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app)
  

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
    console.error(`Error fetching value [${_app_signature}]:`, error);
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
    console.error(`Error fetching api [${_app_signature}]:`, error);
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