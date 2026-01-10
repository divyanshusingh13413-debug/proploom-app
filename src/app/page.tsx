
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, UserCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

type Portal = 'admin' | 'agent' | null;

const RoleSelectionPage = () => {
  const router = useRouter();

  const handlePortalSelect = (portal: Portal) => {
    if (portal === 'admin') {
      router.push('/auth/login');
    } else if (portal === 'agent') {
      router.push('/leads');
    }
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0px 0px 30px rgba(250, 204, 21, 0.4)',
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115] text-white p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key="role-selection"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          className="w-full max-w-4xl text-center"
        >
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-4 font-bold text-4xl tracking-tighter">
              <Building2 className="text-primary h-10 w-10" />
              <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PROPLOOM
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome</h1>
          <p className="text-muted-foreground text-lg mb-12">Please select your portal to continue.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handlePortalSelect('admin')}
              className="p-1 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary/50 cursor-pointer"
            >
              <div className="bg-[#1a1a1a] rounded-xl p-8 h-full flex flex-col items-center justify-center">
                <ShieldCheck className="h-16 w-16 text-primary mb-4" />
                <h2 className="text-3xl font-bold">Admin Portal</h2>
                <p className="text-muted-foreground mt-2">Full access to analytics and settings.</p>
              </div>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handlePortalSelect('agent')}
              className="p-1 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary/50 cursor-pointer"
            >
              <div className="bg-[#1a1a1a] rounded-xl p-8 h-full flex flex-col items-center justify-center">
                <UserCheck className="h-16 w-16 text-primary mb-4" />
                <h2 className="text-3xl font-bold">Agent Portal</h2>
                <p className="text-muted-foreground mt-2">Manage and track your assigned leads.</p>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-12 text-center text-sm text-muted-foreground">
            New user?{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </div>
          
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RoleSelectionPage;
