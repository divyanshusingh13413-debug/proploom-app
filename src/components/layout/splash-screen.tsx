
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreen = ({ onAnimationComplete }: SplashScreenProps) => {

  useEffect(() => {
    const timer = setTimeout(onAnimationComplete, 2800); // A bit shorter than full animation to start fadeout
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  const containerVariants = {
    initial: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  };
  
  const shapeVariants = {
    initial: {
      scale: 0,
      rotate: 45,
    },
    animate: {
      scale: 1,
      rotate: 45,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.8 },
    },
  };
  
  const shimmerVariants = {
    initial: { backgroundPosition: '-200% 0' },
    animate: {
      backgroundPosition: '200% 0',
      transition: { duration: 1.5, ease: 'linear', delay: 1.5, repeat: Infinity, repeatDelay: 1.5 },
    },
  };


  return (
    <AnimatePresence onExitComplete={onAnimationComplete}>
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
        >
            <div className="relative flex items-center justify-center">
            {/* Geometric Shapes */}
            <motion.div
                variants={shapeVariants}
                className="absolute w-64 h-64 md:w-96 md:h-96 border-2 border-[hsl(var(--secondary)/0.5)]"
                style={{
                background: 'radial-gradient(circle, hsl(var(--secondary)/0.05) 0%, transparent 70%)',
                }}
            />
            <motion.div
                variants={shapeVariants}
                initial={{ scale: 0, rotate: 135 }}
                animate={{ scale: 1, rotate: 135, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 } }}
                className="absolute w-56 h-56 md:w-80 md:h-80 border border-[hsl(var(--secondary)/0.3)]"
            />

            {/* Logo and Tagline */}
            <motion.div
                variants={textVariants}
                className="text-center relative z-10"
            >
                <motion.h1 
                    variants={shimmerVariants} 
                    className="text-5xl md:text-7xl font-black tracking-wider shimmer-text"
                >
                    PROPLOOM
                </motion.h1>
                <p className="text-md md:text-lg font-thin tracking-[0.2em] text-gray-300 mt-2 text-glow">
                    Defining Luxury Living
                </p>
            </motion.div>
            </div>
        </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
