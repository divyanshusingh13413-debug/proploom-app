
'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccessDeniedPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.2,
      },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115] text-white p-4">
      <motion.div
        className="w-full max-w-md text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={iconVariants}
          className="mx-auto mb-6 w-24 h-24 flex items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20"
        >
          <div className="relative">
            <Lock className="h-12 w-12 text-primary" />
            <div className="absolute -inset-2 rounded-full bg-primary/20 blur-lg animate-pulse"></div>
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold text-primary mb-2"
        >
          Unauthorized Access
        </motion.h1>

        <motion.p variants={itemVariants} className="text-muted-foreground mb-8">
          Please contact your administrator at Espace Real Estate for permissions.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
