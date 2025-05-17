import { motion } from "framer-motion";

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-t-4 border-primary-500 opacity-75"></div>
        <div className="absolute inset-2 rounded-full border-t-4 border-secondary-500 opacity-75"></div>
        <div className="absolute inset-4 rounded-full border-t-4 border-primary-300 opacity-75"></div>
      </motion.div>
      <motion.p
        className="mt-6 text-gray-600 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingAnimation;
