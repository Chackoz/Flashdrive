import { motion, HTMLMotionProps } from "framer-motion";

interface FadeUpProps extends HTMLMotionProps<"div"> {}

const FadeUp: React.FC<FadeUpProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 1, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}

      className=""
    >
      {children}
    </motion.div>
  );
};

export default FadeUp;
