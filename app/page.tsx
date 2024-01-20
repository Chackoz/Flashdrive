"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import FadeText from "./components/FadeText";
import ProjBox from "./components/ProjBox";
import Marquee from "react-fast-marquee";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import TeamBox from "./components/TeamBox";
import MusicPlayer from "./components/MusicPlayer";
import { useFollowPointer } from "./utils/FollowPointer";
import { debounce } from "lodash";
import Loading from "./components/Loading";

export default function Home() {
  const ref = useRef(null);
  const rocketControl = useAnimation();
  const rocketRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [screenWidth, setScreenWidth] = useState<number>(800);
  const [screenHeight, setScreenHeight] = useState<number>(800);

  const { x, y } = useFollowPointer(footerRef);
  const [xd, setxd] = useState(0);
  const [yd, setyd] = useState(0);
  const controls = useAnimation();

  type Transition$1 =
    | {
        ease: string;
        type: string; // The type can be more specific if necessary
        damping: number;
        stiffness: number;
        restDelta: number;
      }
    | undefined;

  const debouncedX = debounce((value) => {
    setxd(x % 2000);
  }, 16);

  const debouncedY = debounce((value) => {
    setyd(y % 1500);
  }, 16);

  useEffect(() => {
    // Mouse Tracking
    debouncedX(x);
    debouncedY(y);
  }, [x, y]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {};
  });

  let scrollPosition = 0;

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const throttle = (callback: Function, delay: number) => {
      let lastTime = 0;
      return function (...args: any[]) {
        const now = new Date().getTime();
        if (now - lastTime >= delay) {
          lastTime = now;
          callback(...args);
        }
      };
    };

    const interpolate = (
      value: number,
      inputRange: number[],
      outputRange: number[]
    ): number => {
      const [inputMin, inputMax] = inputRange;
      const [outputMin, outputMax] = outputRange;

      if (value <= inputMin) return outputMin;
      if (value >= inputMax) return outputMax;

      const percent = (value - inputMin) / (inputMax - inputMin);
      const outputValue = outputMin + percent * (outputMax - outputMin);
      return outputValue;
    };

    const rocketScroll = throttle(() => {
      if (rocketRef.current) {
        const yPos = rocketRef.current.getBoundingClientRect().top;
        const commonTransition = {
          duration: 0.5,
          ease: "linear",
        };
    
        if (window.innerWidth <= 768) {
          rocketControl.start({
            rotate: yPos < 500 ? 90 : 0,
            transition: commonTransition,
          });
        } else {
          rocketControl.start({
            x: yPos < 400 ? window.innerWidth - 800 : 0,
            transition: commonTransition,
          });
        }
      }
    }, 0);
    

    const handleScroll = throttle(() => {
      scrollPosition = window.scrollY;

      const width = interpolate(scrollPosition, [0, 300], [60, 100]);
      const height = interpolate(scrollPosition, [0, 300], [400, 800]);
      const marginTop = interpolate(scrollPosition, [0, 500], [0, 100]);
      const translateY = interpolate(scrollPosition, [0, 300], [0, 10]);

      controls.set({
        width: `${width}%`,
        height: `${height}px`,
        transition: { duration: 0.5 },
      });

      if (window.innerWidth <= 768) {
        controls.set({
          width: `90%`,
          height: `400px`,
          transition: { duration: 0.5, ease: "linear" },
        });

        controls.start({
          width: `90%`,
          height: `400px`,
        });
      } else {
        controls.start({
          width: `${width}%`,
          height: `${height}px`,
          transition: { duration: 0.5, ease: "linear" },
          marginTop: `${marginTop}px`,
          transform: `translateY(${translateY}px)`,
        });
      }
    }, 16);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", rocketScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", rocketScroll);
    };
  }, [controls, rocketControl]);

  const renderMainContent = () => {
    // Render your main content when loaded
    return (
      <main
        className={`realtive flex flex-col min-h-screen h-full w-full  scroll-smooth transition-all duration-200  `}
        style={{ scrollBehavior: "smooth" }}
      >
        <Toaster
          toastOptions={{
            className: "",
            duration: 3000,
            style: { background: "#363636", color: "#fff" },
          }}
        />
        <div className=" z-10 min-w-[100%] flex flex-col items-center justify-center">
          <section
            className={`flex flex-col h-max w-full max-w-screen  justify-between  pb-[200px]  bg-[#e0e0e0] z-10 min-h-screen`}
          >
            <Navbar />

            <div className="flex md:flex-row flex-col  mx-auto h-full  items-start justify-between mt-[100px] md:max-w-[1500px]">
              <div className="md:flex flex-col hidden h-full mx-auto justify-start max-w-[40%] ">
                <div className="flex items-start justify-start">
                  <div className="flex md:rotate-90 h-[5px] items-start justify-start text-start ">
                    <div className="bg-black h-[25px] w-[35px] rounded-full text-white text-center rotate-90">
                      ⚡
                    </div>
                    <div className="border-black border-[1px] h-[25px] w-[25px] rounded-full text-white text-center">
                      {/* . */}
                    </div>
                    <div className="border-black border-[1px]  h-[25px] w-[25px] rounded-full text-white text-center">
                      {/* . */}
                    </div>
                  </div>
                </div>

                <div className="md:max-w-[45%]    text-lg translate-y-[200px]  p-5 font-poppins">
                  What&apos;s Flash Drive?<br></br>
                  <span className="text-slate-600">
                    well a place where dumb projects meets professional display.
                  </span>
                  <br />
                  <Link
                    href="https://github.com/F-2AN/flashdrive"
                    className="max-w-[150px] border-black border-[1px] px-4 rounded-full text-center my-5 text-[1rem] uppercase"
                  >
                    Github
                  </Link>
                </div>
              </div>

              <div className="flex flex-col md:w-[80%] justify-start items-start font-poppins ">
                <div className="tracking-tighter leading-none md:text-[5.5rem] text-[2.8rem] p-5">
                  <div className="md:h-[100px] overflow-hidden">
                    <FadeText className=" flex text-black  font-poppins ">
                      Pixel Plays,
                    </FadeText>
                  </div>
                  <div className="md:h-[100px] overflow-hidden">
                    <FadeText className="  text-black   ">
                      Shared Joys,
                    </FadeText>
                  </div>
                  <div className="md:h-[100px] overflow-hidden">
                    <FadeText className=" text-black   ">
                      Timeless Games.
                    </FadeText>
                  </div>
                </div>
              </div>

              <div className="flex   md:hidden h-full  justify-start items-center my-[20px]  ">
                <div className="flex rotate-90 h-[5px] items-start justify-start text-start ">
                  <div className="bg-black h-[25px] w-[35px] rounded-full text-white text-center">
                    ⚡
                  </div>
                  <div className="border-black border-[1px] h-[25px] w-[25px] rounded-full text-white text-center">
                    .
                  </div>
                  <div className="border-black border-[1px]  h-[25px] w-[25px] rounded-full text-white text-center">
                    .
                  </div>
                </div>

                <div className=" text-lg translate-y-[20%]">
                  What&apos;s Flash Drive?<br></br>
                  <span className="text-slate-600">
                    well a place where dumb projects meets professional display.
                  </span>
                  <br />
                  <Link
                    href="https://github.com/F-2AN/flashdrive"
                    className="w-[50%] border-black border-[1px] px-4 rounded-full text-center my-5 text-[1rem] uppercase"
                  >
                    Github
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex h-full w-full justify-end ">
              <div
                className={`flex md:w-[90%] w-full h-full items-center md:justify-end justify-center  md:mx-20 md:p-0 p-5 `}
              >
                <motion.div
                  ref={constraintsRef}
                  animate={controls}
                  className="flex bg-[#1b1b1b] opacity-[100%] md:w-[60%] w-[90%] h-[400px] rounded-2xl text-center items-center justify-around px-10"
                >
                  <div className="flex md:flex-row flex-col text-white text-[4rem] uppercase font-logo items-center justify-center ">
                    <motion.div
                      whileHover={{ rotate: [0, 20, 0, -20, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <img src="/logo.png" className="w-[150px]" />
                    </motion.div>

                    <div className="py-5">Flash Drive</div>
                  </div>
                  <div
                    className="md:flex hidden w-[100px] h-[100px] rounded-full bg-yellow-200 animate-spin justify-center items-center"
                    style={{ animationDuration: "4s" }}
                  >
                    ⚡
                    <svg
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      role="image"
                      width="86"
                      height="86"
                      viewBox="0 0 86 86"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>Adi</title>
                      <path
                        fill-rule="evenodd"
                        clipRule="evenodd"
                        d="M2.24136 29.1594L2.06176 29.8318C2.04731 29.8859 2.05425 29.9375 2.08257 29.9865C2.11656 30.0452 2.16447 30.0828 2.22631 30.0994L4.86965 30.8054C4.93148 30.8219 4.97656 30.8546 5.00488 30.9036C5.04094 30.9546 5.0507 31.011 5.03419 31.0729L4.42418 33.3568C4.24252 34.037 4.31854 34.6825 4.65223 35.2932C4.99365 35.9061 5.50831 36.3044 6.19619 36.4881C6.89954 36.676 7.52852 36.5997 8.08315 36.2593C8.6455 35.9209 9.02267 35.3923 9.21465 34.6735L10.125 31.265C10.1395 31.2109 10.1297 31.1545 10.0957 31.0957C10.0674 31.0468 10.0223 31.014 9.96047 30.9975L2.51737 29.0096C2.45554 28.993 2.39628 28.9979 2.33958 29.0242C2.28855 29.0602 2.25581 29.1053 2.24136 29.1594ZM5.35398 33.6424L5.97327 31.3237C5.98979 31.2619 6.02253 31.2168 6.0715 31.1885C6.12819 31.1622 6.18746 31.1573 6.24929 31.1738L8.71873 31.8334C8.78056 31.8499 8.82564 31.8826 8.85396 31.9316C8.88229 31.9806 8.88819 32.036 8.87168 32.0978L8.25238 34.4165C8.15329 34.7875 7.9316 35.0595 7.58729 35.2326C7.24865 35.4154 6.87837 35.4531 6.47646 35.3457C6.09001 35.2425 5.78116 35.0193 5.54991 34.676C5.32433 34.3425 5.25902 33.998 5.35398 33.6424Z"
                        fill="black"
                      ></path>
                      <path
                        d="M0.0546023 42.0611L1.91514e-05 46.9328C-0.000697867 46.9968 0.0187187 47.049 0.0582681 47.0895C0.105727 47.138 0.157454 47.1626 0.213451 47.1632L0.765416 47.1694C0.829412 47.1701 0.881678 47.1467 0.922213 47.0991C0.970658 47.0597 0.99524 47.008 0.995957 46.944L1.03777 43.2122C1.03849 43.1482 1.05911 43.0924 1.09965 43.0449C1.14809 43.0054 1.20031 42.986 1.25631 42.9866L7.97589 43.0619C8.03988 43.0626 8.09215 43.0392 8.13268 42.9917C8.18113 42.9522 8.20566 42.9045 8.20629 42.8485L8.21409 42.1525C8.21472 42.0965 8.1913 42.0443 8.14384 41.9957C8.10429 41.9553 8.05252 41.9347 7.98852 41.934L0.285008 41.8477C0.221012 41.847 0.164792 41.8663 0.116347 41.9058C0.0758114 41.9533 0.0552297 42.0051 0.0546023 42.0611Z"
                        fill="black"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clipRule="evenodd"
                        d="M2.15259 56.739L1.97392 56.0044C1.9588 55.9422 1.96205 55.8879 1.98369 55.8415C2.00533 55.795 2.05418 55.742 2.13023 55.6823L3.4053 54.73C3.45404 54.6935 3.4824 54.6577 3.49039 54.6229C3.50026 54.5958 3.49669 54.5472 3.47967 54.4773L2.57501 50.7577C2.56366 50.7111 2.53772 50.6721 2.49717 50.6408C2.4644 50.6076 2.41797 50.586 2.35788 50.5759L0.787885 50.3155C0.718135 50.2996 0.662042 50.272 0.619604 50.233C0.577167 50.1939 0.54744 50.1394 0.530425 50.0694L0.36594 49.3931C0.348924 49.3232 0.363841 49.266 0.410693 49.2217C0.465317 49.1755 0.535278 49.1585 0.620575 49.1706L8.8711 50.6466C8.93896 50.6548 8.99505 50.6823 9.03938 50.7292C9.08371 50.776 9.11533 50.8383 9.13423 50.9161L9.2817 51.5224C9.29305 51.569 9.28695 51.6117 9.26342 51.6503C9.24178 51.6968 9.19976 51.744 9.13736 51.7921L2.47213 56.8342C2.41562 56.8726 2.35248 56.8838 2.28273 56.8679C2.21298 56.8519 2.1696 56.8089 2.15259 56.739ZM4.45219 53.9567L7.69247 51.5384C7.7139 51.525 7.72273 51.5105 7.71895 51.4949C7.71705 51.4872 7.70256 51.4783 7.67546 51.4685L3.68365 50.7968C3.63323 50.7926 3.59825 50.8011 3.57871 50.8223C3.55917 50.8436 3.55508 50.8775 3.56642 50.9241L4.29242 53.9091C4.30187 53.948 4.32015 53.9723 4.34725 53.9822C4.38213 53.9902 4.41711 53.9817 4.45219 53.9567Z"
                        fill="black"
                      ></path>
                      <path
                        d="M5.84676 64.4404L6.19504 65.043C6.22306 65.0915 6.2644 65.123 6.31904 65.1376C6.38462 65.1552 6.44511 65.1479 6.50053 65.1159L8.89012 63.7348C8.98709 63.6788 9.06182 63.6402 9.1143 63.6191C9.1708 63.6049 9.23129 63.5977 9.29579 63.5974L14.5631 63.8379C14.6385 63.8405 14.6994 63.81 14.7457 63.7462C14.792 63.6825 14.7951 63.616 14.7551 63.5467L14.4068 62.9441C14.3788 62.8956 14.3499 62.8615 14.32 62.8419C14.2941 62.8291 14.238 62.8199 14.1517 62.8144L9.76275 62.6067L11.7475 58.7985C11.7956 58.706 11.8236 58.6344 11.8313 58.5838C11.839 58.5331 11.8248 58.4766 11.7888 58.4143L11.4225 57.7805C11.3824 57.7113 11.3232 57.6808 11.2449 57.6891C11.1705 57.7044 11.1122 57.7473 11.0699 57.818L8.62649 62.4873C8.60095 62.539 8.56247 62.5844 8.51106 62.6233C8.46366 62.6692 8.40186 62.7141 8.32567 62.7582L5.93608 64.1393C5.88066 64.1713 5.84219 64.2166 5.82065 64.2753C5.81003 64.3369 5.81874 64.3919 5.84676 64.4404Z"
                        fill="black"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clipRule="evenodd"
                        d="M24.7892 81.733L24.143 81.4744C24.091 81.4536 24.0502 81.4158 24.0205 81.3608C24.0012 81.3014 24.0034 81.2419 24.0272 81.1825L26.8893 74.0299C26.9131 73.9705 26.9509 73.9296 27.0029 73.9073C27.0653 73.8806 27.1225 73.8776 27.1745 73.8985L30.45 75.2091C31.1408 75.4855 31.6206 75.9231 31.8894 76.5218C32.1612 77.1131 32.1618 77.7467 31.8914 78.4226C31.6268 79.0836 31.17 79.5471 30.5208 79.8129C29.8745 80.0713 29.2246 80.0697 28.571 79.8082L26.3761 78.93C26.3167 78.9062 26.2595 78.9091 26.2046 78.9388C26.1526 78.9611 26.1147 79.002 26.0909 79.0614L25.0745 81.6016C25.0507 81.661 25.0076 81.7041 24.9452 81.7308C24.8932 81.7531 24.8412 81.7538 24.7892 81.733ZM26.7372 78.0275L28.9655 78.9191C29.3071 79.0559 29.657 79.0321 30.015 78.848C30.3835 78.6593 30.642 78.3793 30.7906 78.008C30.9452 77.6217 30.9519 77.2496 30.8108 76.8916C30.6801 76.5291 30.4365 76.2765 30.08 76.1338L27.8518 75.2422C27.7923 75.2185 27.7366 75.2177 27.6846 75.24C27.6326 75.2623 27.5948 75.3031 27.571 75.3625L26.6214 77.7356C26.5976 77.795 26.5954 77.8544 26.6147 77.9139C26.637 77.9659 26.6778 78.0037 26.7372 78.0275Z"
                        fill="black"
                      ></path>
                      <path
                        d="M36.6914 85.1855L41.5217 85.8211C41.5852 85.8295 41.6393 85.8164 41.6842 85.782C41.7381 85.7407 41.7687 85.6922 41.776 85.6367L41.848 85.0894C41.8563 85.026 41.8393 84.9713 41.7969 84.9254C41.7635 84.8726 41.7151 84.842 41.6517 84.8336L37.9516 84.3467C37.8881 84.3384 37.8352 84.3112 37.7928 84.2653C37.7594 84.2125 37.7464 84.1583 37.7537 84.1028L38.6305 77.4403C38.6388 77.3768 38.6218 77.3221 38.5794 77.2762C38.546 77.2234 38.5016 77.1933 38.446 77.186L37.756 77.0952C37.7005 77.0879 37.6458 77.1049 37.5919 77.1462C37.5471 77.1807 37.5204 77.2296 37.5121 77.2931L36.507 84.9312C36.4986 84.9947 36.5111 85.0528 36.5445 85.1056C36.5869 85.1515 36.6358 85.1782 36.6914 85.1855Z"
                        fill="black"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clipRule="evenodd"
                        d="M51.5146 84.8538L50.764 84.9435C50.7004 84.9511 50.6469 84.9414 50.6034 84.9144C50.5599 84.8874 50.513 84.8325 50.4629 84.7499L49.6695 83.3703C49.6391 83.3175 49.607 83.2851 49.5733 83.273C49.5476 83.26 49.499 83.2577 49.4275 83.2663L45.6265 83.7205C45.5789 83.7262 45.5371 83.7473 45.5012 83.7839C45.4643 83.8124 45.4373 83.856 45.4201 83.9144L44.9742 85.4421C44.95 85.5095 44.916 85.5619 44.8722 85.5993C44.8283 85.6368 44.7706 85.6598 44.6991 85.6684L44.008 85.7509C43.9366 85.7595 43.8816 85.7379 43.8432 85.6861C43.8038 85.6263 43.7953 85.5548 43.8176 85.4716L46.2677 77.4562C46.2839 77.3898 46.318 77.3374 46.3698 77.299C46.4216 77.2606 46.4872 77.2366 46.5666 77.2271L47.1862 77.1531C47.2339 77.1474 47.2755 77.1585 47.3111 77.1865C47.3546 77.2135 47.3965 77.2609 47.4368 77.3286L51.6473 84.5479C51.6787 84.6086 51.6823 84.6726 51.6581 84.74C51.634 84.8073 51.5861 84.8453 51.5146 84.8538ZM49.0267 82.2386L47.0125 78.7328C47.0017 78.71 46.9883 78.6995 46.9724 78.7014C46.9645 78.7023 46.954 78.7157 46.941 78.7414L45.7977 82.6245C45.7875 82.674 45.7918 82.7098 45.8105 82.7317C45.8292 82.7537 45.8624 82.7618 45.9101 82.7561L48.9604 82.3915C49.0001 82.3868 49.0265 82.3715 49.0395 82.3458C49.0516 82.3121 49.0473 82.2764 49.0267 82.2386Z"
                        fill="black"
                      ></path>
                      <path
                        d="M59.602 82.1054L60.2419 81.8315C60.2934 81.8095 60.3296 81.7722 60.3507 81.7197C60.3759 81.6567 60.3759 81.5957 60.3508 81.5369L59.2647 78.9996C59.2207 78.8966 59.1913 78.8178 59.1766 78.7632C59.1693 78.7054 59.1693 78.6445 59.1767 78.5804L60.0442 73.3795C60.0558 73.3049 60.0327 73.2408 59.9749 73.1872C59.9172 73.1336 59.8516 73.1226 59.778 73.154L59.1382 73.4279C59.0867 73.4499 59.0494 73.4746 59.0262 73.5019C59.0105 73.5261 58.9947 73.5807 58.9789 73.6657L58.2489 77.9985L54.7048 75.5735C54.6187 75.5146 54.5509 75.4783 54.5015 75.4646C54.4522 75.451 54.3944 75.4583 54.3282 75.4866L53.6553 75.7747C53.5817 75.8061 53.5444 75.8613 53.5433 75.94C53.5496 76.0157 53.5853 76.0787 53.6504 76.1292L57.9947 79.1124C58.043 79.1439 58.0834 79.1876 58.116 79.2432C58.1558 79.2958 58.1931 79.3625 58.2277 79.4434L59.3138 81.9808C59.3389 82.0396 59.3794 82.0832 59.435 82.1116C59.4949 82.1295 59.5506 82.1274 59.602 82.1054Z"
                        fill="black"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clipRule="evenodd"
                        d="M79.0316 65.3623L78.6978 65.973C78.6709 66.0222 78.6285 66.0582 78.5703 66.0811C78.509 66.0932 78.4503 66.0839 78.3941 66.0532L71.6342 62.3579C71.5781 62.3272 71.542 62.2847 71.5261 62.2304C71.507 62.1653 71.5109 62.1081 71.5378 62.059L73.23 58.9633C73.5869 58.3105 74.0786 57.8864 74.7051 57.691C75.3246 57.4917 75.9538 57.5666 76.5925 57.9158C77.2173 58.2574 77.6229 58.7663 77.8093 59.4426C77.9888 60.1151 77.9096 60.7602 77.572 61.3779L76.438 63.4522C76.4073 63.5083 76.4035 63.5655 76.4264 63.6236C76.4423 63.6779 76.4783 63.7204 76.5345 63.7511L78.9352 65.0634C78.9914 65.0941 79.029 65.1421 79.0481 65.2072C79.064 65.2615 79.0585 65.3132 79.0316 65.3623ZM75.5852 62.986L76.7363 60.8801C76.9129 60.5572 76.9311 60.207 76.7909 59.8295C76.6476 59.4412 76.4005 59.1511 76.0495 58.9592C75.6845 58.7597 75.3158 58.7086 74.9435 58.8059C74.568 58.8924 74.2882 59.1041 74.104 59.4411L72.9528 61.547C72.9221 61.6031 72.9147 61.6583 72.9306 61.7126C72.9465 61.7669 72.9826 61.8094 73.0387 61.8401L75.2815 63.0661C75.3376 63.0968 75.3964 63.1061 75.4577 63.0941C75.512 63.0781 75.5545 63.0421 75.5852 62.986Z"
                        fill="black"
                      ></path>
                      <path
                        d="M83.88 53.9574L85.0876 49.2374C85.1034 49.1754 85.0969 49.1201 85.0681 49.0714C85.0335 49.013 84.9891 48.9769 84.9348 48.963L84.4001 48.8262C84.3381 48.8103 84.2817 48.8207 84.2311 48.8573C84.1747 48.8841 84.1385 48.9285 84.1227 48.9905L83.1976 52.6061C83.1817 52.6681 83.1485 52.7174 83.0978 52.754C83.0414 52.7808 82.9861 52.7873 82.9318 52.7734L76.4215 51.1077C76.3595 51.0919 76.3032 51.1022 76.2526 51.1388C76.1961 51.1657 76.161 51.2062 76.1471 51.2605L75.9746 51.9348C75.9607 51.989 75.9711 52.0454 76.0057 52.1038C76.0345 52.1524 76.0799 52.1847 76.1419 52.2005L83.6055 54.1101C83.6675 54.126 83.7267 54.1205 83.7832 54.0936C83.8338 54.0571 83.8661 54.0116 83.88 53.9574Z"
                        fill="black"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clipRule="evenodd"
                        d="M85.3204 39.2001L85.3199 39.9561C85.3198 40.0201 85.3038 40.0721 85.2718 40.1121C85.2398 40.1521 85.1797 40.192 85.0917 40.232L83.6273 40.855C83.5713 40.8789 83.5352 40.9069 83.5192 40.9389C83.5032 40.9629 83.4952 41.0109 83.4951 41.0829L83.4925 44.9109C83.4924 44.9589 83.5084 45.0029 83.5404 45.0429C83.5643 45.0829 83.6043 45.1149 83.6603 45.139L85.1239 45.764C85.1879 45.796 85.2358 45.8361 85.2678 45.8841C85.2998 45.9321 85.3157 45.9921 85.3157 46.0641L85.3152 46.7601C85.3151 46.8321 85.2871 46.8841 85.2311 46.9161C85.1671 46.948 85.0951 46.948 85.0151 46.9159L77.3494 43.5266C77.2854 43.5026 77.2375 43.4625 77.2055 43.4065C77.1735 43.3505 77.1576 43.2825 77.1576 43.2025L77.1581 42.5785C77.1581 42.5305 77.1741 42.4905 77.2062 42.4585C77.2382 42.4185 77.2902 42.3826 77.3622 42.3506L85.0325 39.0319C85.0965 39.008 85.1605 39.012 85.2245 39.0441C85.2885 39.0761 85.3205 39.1281 85.3204 39.2001ZM82.4269 41.3581L78.7058 42.9396C78.6818 42.9475 78.6698 42.9595 78.6698 42.9755C78.6698 42.9835 78.6818 42.9955 78.7058 43.0116L82.4247 44.6101C82.4727 44.6262 82.5087 44.6262 82.5327 44.6102C82.5567 44.5942 82.5687 44.5622 82.5687 44.5142L82.5709 41.4422C82.5709 41.4022 82.5589 41.3742 82.5349 41.3582C82.5029 41.3422 82.4669 41.3422 82.4269 41.3581Z"
                        fill="black"
                      ></path>
                      <path
                        d="M83.5566 30.8425L83.361 30.1745C83.3453 30.1208 83.3126 30.0803 83.263 30.0532C83.2035 30.0206 83.143 30.0133 83.0815 30.0313L80.4327 30.8067C80.3252 30.8382 80.2435 30.8579 80.1875 30.866C80.1292 30.8663 80.0688 30.859 80.006 30.8441L74.9458 29.362C74.8732 29.3416 74.8068 29.3569 74.7467 29.4078C74.6866 29.4588 74.6678 29.5226 74.6902 29.5994L74.8858 30.2674C74.9015 30.3211 74.9215 30.3611 74.9459 30.3873C74.968 30.4058 75.0203 30.428 75.1029 30.4539L79.3176 31.6958L76.4869 34.9252C76.4181 35.0036 76.374 35.0665 76.3546 35.1139C76.3351 35.1613 76.3355 35.2195 76.3557 35.2886L76.5613 35.9912C76.5838 36.0679 76.6341 36.1116 76.7122 36.122C76.788 36.1249 76.8549 36.0969 76.9128 36.0383L80.3932 32.0811C80.4302 32.0369 80.4784 32.002 80.5375 31.9763C80.5945 31.943 80.6652 31.914 80.7496 31.8893L83.3985 31.1138C83.4599 31.0959 83.508 31.0609 83.5428 31.0091C83.5677 30.9517 83.5723 30.8962 83.5566 30.8425Z"
                        fill="black"
                      ></path>
                    </svg>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="z-10 w-full  bg-[#e0e0e0] ">
            <div
              className="flex flex-col md:w-[80%] w-[95%] mx-auto h-fit  text-[5rem] font-poppins2 leading-none tracking-tight  "
              id="portfolio"
            >
              <div className="flex md:w-[55%] md:text-[4.5rem] text-[3rem] justify-end items-start">
                Mixing up work and play , proffesionaly 😉.
              </div>

              <div
                className={`flex md:flex-row flex-col justify-around items-center  p-5 `}
              >
                <div className="flex flex-col gap-3">
                  <ProjBox
                    ImageUrl="/stb2.png"
                    header="Stable Diffusion"
                    desc="Web Ui"
                    href="/collection"
                  />
                  <ProjBox
                    ImageUrl="/stb4.png"
                    header="Slide 8"
                    desc="Coming Soon"
                    href="/"
                  />
                </div>
                <div className="flex flex-col gap-6 md:mt-[200px]">
                  <ProjBox
                    ImageUrl="/snake.png"
                    header="Snake Game"
                    desc="Game"
                    href="/games/snake"
                  />
                  <ProjBox
                    ImageUrl="/stb6.png"
                    header="The Duck"
                    desc="Ahem"
                    href="/duck"
                  />
                </div>
              </div>
              <motion.div
                ref={rocketRef}
                animate={rocketControl}
                className=" items-start justify-start  max-w-[500px]"
              >
                <img src="/rocket.png" />
              </motion.div>
            </div>
          </section>
          <section
            id="about"
            className="z-10 flex flex-col items-center  min-h-fit  w-full  bg-[#e0e0e0] "
          >
            <div className="flex flex-col md:w-[99%] w-[full] mx-auto min-h-fit  text-[5rem] font-poppins2 leading-none tracking-tight bg-[#e0e0e0]  justify-center">
              <div className="flex flex-col md:w-[90%] md:text-[4.5rem] text-[3rem] justify-start items-start p-5">
                Meet the Team
              </div>
              <div className="flex md:md:flex-row flex-col md:pt-[100px] h-full justify-center items-center  min-h-fit">
                <div className="w-full flex md:flex-row flex-wrap flex-col h-full items-center justify-center">
                  <TeamBox
                    name="Faris Ziyad"
                    imgurl="https://avatars.githubusercontent.com/u/80464044?v=4"
                    githuburl="https://github.com/AFK-Trixo"
                    linkedinurl="https://www.linkedin.com/in/faris-ziyad-5a6055247/"
                  />
                  <TeamBox
                    name="Ferwin Lopez"
                    imgurl="/Ferwin.jpg"
                    githuburl="https://github.com/Fer-Win"
                    linkedinurl="https://www.linkedin.com/in/ferwin-lopez/"
                  />
                  <TeamBox
                    name="Adithya Krishnan"
                    imgurl="/Adi.jpg"
                    githuburl="https://github.com/fal3n-4ngel"
                    linkedinurl="https://www.linkedin.com/in/fal3n-4ngel/"
                  />
                  <TeamBox
                    name="Nevia Sebastian"
                    imgurl="https://assets-global.website-files.com/632ac1a36830f75c7e5b16f0/64f116759667a1fbf0c59c60_fOqQSv2iutbUbwh3tXUdPBe4m_mX5ChHOYvM7taH_SE.webp"
                    githuburl="https://github.com/neviaseb03"
                    linkedinurl="https://www.linkedin.com/in/nevia-sebastian-086566234/"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* <section className="w-full  flex-col bg-[#1b1b1b] flex md:hidden pt-[100px]">
          <div className="flex flex-col justify-center items-center text-center z-[1] text-slate-100">
            <div className="md:text-[4rem] text-[2.5rem] font-poppins opacity-75">
              So this is it...
            </div>
            <div className="flex group md:text-[6.5rem] text-[3.2rem] font-poppins cursor-pointer">
              <div className="group-hover:-rotate-20 group-hover:translate-x-[100px] group-hover:translate-y-[-100px]  transition-all duration-[400] delay-200">
                T
              </div>
              <div className="group-hover:rotate-45 group-hover:-translate-x-[80px] group-hover:translate-y-25 transition-all duration-[400] delay-200 letter">
                h
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[-70px] group-hover:translate-y-[60px] transition-all duration-[400] delay-200 letter">
                e
              </div>
              <div className="group-hover:rotate-90 transition-all duration-[400] delay-200 letter"></div>
              &nbsp;
              <div className="group-hover:rotate-90 group-hover:translate-x-[40px] group-hover:translate-y-[80px] transition-all duration-[400] delay-200 letter">
                F
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[10px] group-hover:translate-y-[-40px] transition-all duration-[400] delay-200 letter">
                l
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[-90px] group-hover:translate-y-[30px] transition-all duration-[400] delay-200 letter">
                a
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[70px] group-hover:translate-y-[-20px] transition-all duration-[400] delay-200 letter">
                s
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[-20px] group-hover:translate-y-[90px] transition-all duration-[400] delay-200 letter">
                h
              </div>
              <div className="group-hover:rotate-90 transition-all duration-[400] delay-200 letter"></div>
              &nbsp;
              <div className="group-hover:rotate-90 group-hover:translate-x-[80px] group-hover:translate-y-[10px] transition-all duration-[400] delay-200 letter">
                D
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[-50px] group-hover:translate-y-[50px] transition-all duration-[400] delay-200 letter">
                r
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[60px] group-hover:translate-y-[70px] transition-all duration-[400] delay-200 letter">
                i
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[-30px] group-hover:translate-y-[-60px] transition-all duration-[400] delay-200 letter">
                v
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[20px] group-hover:translate-y-[40px] transition-all duration-[400] delay-200 letter">
                e
              </div>
            </div>
          </div>
          <div className="flex md:text-[2rem] text-[1.5rem] text-center justify-center items-center gap-6 p-5 text-white">
            <Link
              href="https://github.com/F-2AN"
              className=" hover:text-white hover:scale-125 transition-all duration-[400] delay-200"
            >
              Github
            </Link>
            -
            <Link
              href="https://github.com/F-2AN"
              className="hover:text-white hover:scale-125 transition-all duration-[400] delay-200"
            >
              Github
            </Link>
            -
            <Link
              href="https://github.com/F-2AN"
              className="hover:text-white hover:scale-125 transition-all duration-[400] delay-200"
            >
              Github
            </Link>
          </div>
          <Marquee
            className=" animate-pulse md:text-[5rem] text-[4rem] text-white"
            autoFill={true}
          >
            ©️ F^2 AN 2023 &nbsp;
          </Marquee>
        </section> */}
        </div>
        <section className="min-h-screen bg-transparent flex "></section>

        <section
          id="Footer"
          ref={footerRef}
          className=" fixed flex flex-col min-h-screen w-full h-full justify-between items-center  bg-[#1c1c1c] z-1 text-[#e0e0e0] "
        >
          <div className="text-black">.</div>
          <div className="flex flex-col justify-center items-center text-center z-[1]">
            <div className="md:text-[4rem] text-[2.0rem] font-poppins opacity-75">
              So this is it...
            </div>
            <div className="flex group md:text-[6.5rem] text-[2.5rem] font-poppins cursor-pointer">
              <div className="group-hover:-rotate-20 group-hover:translate-x-[100px] group-hover:translate-y-[-100px]  transition-all duration-[400] delay-200">
                T
              </div>
              <div className="group-hover:rotate-45 group-hover:-translate-x-[80px] group-hover:translate-y-25 transition-all duration-[400] delay-200 letter">
                h
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[-70px] group-hover:translate-y-[60px] transition-all duration-[400] delay-200 letter">
                e
              </div>
              <div className="group-hover:rotate-90 transition-all duration-[400] delay-200 letter"></div>
              &nbsp;
              <div className="group-hover:rotate-90 group-hover:translate-x-[40px] group-hover:translate-y-[80px] transition-all duration-[400] delay-200 letter">
                F
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[10px] group-hover:translate-y-[-40px] transition-all duration-[400] delay-200 letter">
                l
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[-90px] group-hover:translate-y-[30px] transition-all duration-[400] delay-200 letter">
                a
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[70px] group-hover:translate-y-[-20px] transition-all duration-[400] delay-200 letter">
                s
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[-20px] group-hover:translate-y-[90px] transition-all duration-[400] delay-200 letter">
                h
              </div>
              <div className="group-hover:rotate-90 transition-all duration-[400] delay-200 letter"></div>
              &nbsp;
              <div className="group-hover:rotate-90 group-hover:translate-x-[80px] group-hover:translate-y-[10px] transition-all duration-[400] delay-200 letter">
                D
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[-50px] group-hover:translate-y-[50px] transition-all duration-[400] delay-200 letter">
                r
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[60px] group-hover:translate-y-[70px] transition-all duration-[400] delay-200 letter">
                i
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[-30px] group-hover:translate-y-[-60px] transition-all duration-[400] delay-200 letter">
                v
              </div>
              <div className="group-hover:rotate-90 group-hover:translate-x-[20px] group-hover:translate-y-[40px] transition-all duration-[400] delay-200 letter">
                e
              </div>
            </div>
          </div>
          <div className="w-full text-[3rem] font-logo mb-10">
            <motion.main
              className="flex flex-col w-full h-full  font-poppins    text-black  transition-all duration-200 z-[1]"
              animate={{ x: 0, y: 0 }}
              transition={
                {
                  ease: "easein",
                  type: "spring",
                  damping: 10,
                  stiffness: 45,
                  restDelta: 0.0001,
                } as Transition$1
              }
            >
              <motion.div
                className="opacity-[60%]"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                }}
                animate={{ x: xd, y: yd, top: 0, left: 0 }}
                transition={
                  {
                    type: "spring",
                    damping: 10,
                    stiffness: 80,
                    restDelta: 0.01,
                  } as Transition$1
                }
              >
                <div className="w-[200px] h-[200px] bg-white"></div>
              </motion.div>

              <motion.div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                }}
                animate={{ x: xd, y: yd, top: 0, left: 0 }}
                transition={
                  {
                    type: "spring",
                    damping: 10,
                    stiffness: 90,
                    restDelta: 0.01,
                  } as Transition$1
                }
              >
                <MusicPlayer />
              </motion.div>
              <div className="flex md:text-[2rem] text-[1.0rem] text-center justify-center items-center gap-6 p-5 text-white">
                <Link
                  href="https://github.com/F-2AN"
                  className=" hover:text-white hover:scale-125 transition-all duration-[400] delay-200"
                >
                  Github
                </Link>
                -
                <Link
                  href="https://github.com/F-2AN"
                  className="hover:text-white hover:scale-125 transition-all duration-[400] delay-200"
                >
                  Github
                </Link>
                -
                <Link
                  href="https://github.com/F-2AN"
                  className="hover:text-white hover:scale-125 transition-all duration-[400] delay-200"
                >
                  Github
                </Link>
              </div>
              <Marquee
                className=" animate-pulse md:text-[5rem] text-[4rem] text-white"
                autoFill={true}
              >
                ©️ F^2 AN 2023 &nbsp;
              </Marquee>
            </motion.main>
          </div>
        </section>
      </main>
    );
  };
  useEffect(() => {
    // Scroll to the top after content is loaded
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full">
      {!isLoaded ? (
        // Display the loading screen while waiting for data to load
        <Loading />
      ) : (
        // Render the main content when data is loaded
        renderMainContent()
      )}
    </div>
  );
}
