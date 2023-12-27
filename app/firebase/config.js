
import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth,GoogleAuthProvider,GithubAuthProvider} from "firebase/auth"
//import { getAnalytics } from "firebase/analytics";

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
const googleAuthProvider = new GoogleAuthProvider();
const githubAuthProvider = new GithubAuthProvider();

const auth = getAuth(app);
//const analytics = getAnalytics(app);

export {app,auth,googleAuthProvider,githubAuthProvider}