// Semi Optmised
import React, { useEffect} from "react";
import { useAuth } from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function Navbar() {
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        console.log("User Not Logged in : Navbar line 16");
      }
    };
    checkUser();
    return () => {};
  }, [user]);

  return (
    <>
    <div className=" flex  justify-between items-center font-poppins mx-auto w-[90%] scroll-smooth">
      <a href="/" className="flex cursor-pointer">
        <Image
          src="/logo.png"
          className="w-[50px]"
          alt=""
          width={50}
          height={50}
        />
        <div className="font-logo text-xl py-5">FLASH DRIVE</div>
      </a>
      <div className="md:flex hidden gap-6">
        <Link href="/" >Home</Link>
        <Link href="#portfolio" scroll={false} >Portfolio</Link>
        <Link href="#team" scroll={false}>Team</Link>
        <Link href="#Footer" scroll={false}> Contact</Link>
      </div>
      {!user && (
        <a
          href="/login"
          className="border-black border-[1px] px-4 rounded-full cursor-pointer p-1 hover:bg-[#2d2d2d] hover:text-white transition-all duration-75"
        >
          Login
        </a>
      )}
      {user && (
        <button
          onClick={() => {
            signOut(auth);
            router.push("/");
          }}
          className="border-black border-[1px] px-4 rounded-full cursor-pointer p-1 hover:bg-[#2d2d2d] hover:text-white transition-all duration-75"
        >
          Logout
        </button>
      )}
    </div>
    </>
  );
}

export default Navbar;
