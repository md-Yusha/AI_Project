import { motion } from "framer-motion";

const Header = () => {
  return (
    <header className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 animate-gradient">
              AI Art Generator
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-600 text-center max-w-2xl">
            Transform your photos into beautiful AI-generated pencil sketches or
            Studio Ghibli style art with just a few clicks
          </p>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
