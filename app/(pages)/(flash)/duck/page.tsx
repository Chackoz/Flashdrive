"use client"
import React, { useRef } from "react";
import { motion, useAnimation } from "framer-motion";

function Page() {
  const constraintsRef = useRef(null)
  return (
    <main ref={constraintsRef}>
      <motion.div  drag
      dragConstraints={constraintsRef} >
        <img src="/images/duck.png" />
      </motion.div>
    </main>
  );
}

export default Page;
