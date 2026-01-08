
'use client';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const hasFinished = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasFinished.current) {
        hasFinished.current = true;
        onFinish();
      }
    }, 3000); // Total duration of splash screen

    return () => clearTimeout(timer);
  }, [onFinish]);

  const shapeVariants = {
    hidden: { scale: 0, rotate: -45, opacity: 0 },
    visible: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1, 
      transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] } 
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { delay: 0.5, duration: 0.8, ease: 'easeOut' } 
    },
  };

  const shimmerVariants = {
    shimmer: {
      backgroundPosition: ['-200% 0', '200% 0'],
      transition: {
        duration: 1.5,
        ease: 'linear',
        delay: 1,
      },
    },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
      <div className="absolute inset-0 pattern-bg opacity-10"></div>
      
      <motion.div
        className="relative w-48 h-48 flex items-center justify-center"
        variants={shapeVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute w-full h-full border-2 border-amber-400/50 rounded-2xl transform rotate-45"></div>
        <div className="absolute w-3/4 h-3/4 border border-amber-300/30 rounded-lg transform rotate-12"></div>
      </motion.div>

      <motion.div 
        className="absolute flex flex-col items-center justify-center text-center z-10"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-6xl font-black text-glow shimmer-text tracking-tighter"
          variants={shimmerVariants}
          animate="shimmer"
        >
          PROPLOOM
        </motion.h1>
        <p className="text-base text-amber-100/70 tracking-widest mt-2">
          Defining Luxury Living
        </p>
      </motion.div>

    </div>
  );
};

export default SplashScreen;
