
'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

  const splashImage = PlaceHolderImages.find(img => img.id === 'analytics-illustration');

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.3 },
    },
    exit: { opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const itemVariants = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] } },
  };

  const barVariants = {
    initial: { scaleX: 0 },
    animate: { scaleX: 1, transition: { duration: 1, ease: 'easeInOut', delay: 0.8 } }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F1115] p-4"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex flex-col items-center justify-center text-center">
        {splashImage && (
          <motion.div variants={itemVariants} className="mb-8">
            <Image
              src={splashImage.imageUrl}
              alt={splashImage.description}
              width={600}
              height={400}
              priority
              data-ai-hint={splashImage.imageHint}
              className="max-w-md w-full"
            />
          </motion.div>
        )}

        <motion.h1
          variants={itemVariants}
          className="text-5xl font-black tracking-widest uppercase bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"
        >
          PROPLOOM
        </motion.h1>

        <motion.p variants={itemVariants} className="mt-2 text-lg text-gray-400">
          Powering Your Real Estate Business
        </motion.p>
        
        <div className="mt-8 w-24 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 origin-left"
                variants={barVariants}
            />
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
