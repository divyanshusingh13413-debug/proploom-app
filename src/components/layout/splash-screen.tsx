
'use client';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] } },
  };

  const svgVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence>
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F1115]"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <motion.div className="w-48 h-48" variants={itemVariants}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
                        <stop offset="100%" style={{ stopColor: 'hsl(var(--secondary))' }} />
                        </linearGradient>
                    </defs>
                    <motion.path
                        d="M50 15 L85 40 L85 85 L15 85 L15 40 Z"
                        stroke="url(#iconGradient)"
                        strokeWidth="3"
                        fill="none"
                        variants={svgVariants}
                    />
                    <motion.path
                        d="M35 85 L35 55 L65 55 L65 85"
                        stroke="url(#iconGradient)"
                        strokeWidth="3"
                        fill="none"
                        variants={svgVariants}
                        initial="initial"
                        animate="animate"
                    />
                    <motion.circle
                        cx="50"
                        cy="40"
                        r="8"
                        stroke="url(#iconGradient)"
                        strokeWidth="3"
                        fill="none"
                        variants={svgVariants}
                        initial="initial"
                        animate="animate"
                    />
                </svg>
            </motion.div>
            <motion.h1
                className="mt-6 text-4xl font-black tracking-widest uppercase bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                variants={itemVariants}
            >
                PROPLOOM
            </motion.h1>
        </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
