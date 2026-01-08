
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    // Start typing animation after a short delay
    const typingTimer = setTimeout(() => {
      setShowTyping(true);
    }, 800); 

    // Finish splash screen after total duration
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 4500); // Total 4.5 seconds for splash screen

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const typingVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 2, // Typing speed
        ease: "linear",
        delay: 0.5,
      },
    },
  };

  const cursorVariants = {
    blinking: {
      opacity: [0, 1, 1, 0],
      transition: {
        duration: 0.7,
        repeat: Infinity,
        repeatDelay: 0,
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#0d0f12] text-white z-50 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1 
        className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent tracking-wide"
        variants={itemVariants}
      >
        PROPLOOM
      </motion.h1>
      
      <motion.div 
        className="relative text-lg text-gray-400 font-light overflow-hidden whitespace-nowrap"
        style={{ width: '250px' }} // Fixed width for typing effect
      >
        {showTyping && (
          <motion.span 
            className="inline-block"
            variants={typingVariants}
            initial="hidden"
            animate="visible"
          >
            Your Gateway to Luxury
          </motion.span>
        )}
        {showTyping && (
          <motion.span 
            className="inline-block absolute top-0 right-0 h-full bg-[#0d0f12] w-[2px]" 
            variants={cursorVariants}
            animate="blinking"
          />
        )}
      </motion.div>

      <motion.p 
        className="text-sm text-gray-600 mt-12"
        variants={itemVariants}
      >
        Crafting premium experiences.
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;
