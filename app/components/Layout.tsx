// components/Layout/index.js
"use client"
import { motion } from "framer-motion";
import { ReactNode } from "react";
interface LayoutProps {
  children: ReactNode;
}

const pageTransition = {
    initial: { opacity: 0, scale: 0.8},
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8},
  };

const Layout: React.FC<LayoutProps> = ({ children }) => (
    <motion.div className="flex justify-center items-center w-full h-full"
    variants={pageTransition}
    initial="initial"
    animate="animate"
    exit="exit"
    >
      {children}
    </motion.div>
  );
export default Layout;
