'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, UserCheck, Loader2 } from 'lucide-react';
import SplashScreen from '@/components/layout/splash-screen';

const RoleSelectionPage = () => {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('splashShown')) {
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => {
        sessionStorage.setItem('splashShown', 'true');
        setShowSplash(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, fetch role and redirect
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;
            if (role === 'admin') {
              router.replace('/dashboard');
            } else { // Assume agent if not admin
              router.replace('/leads');
            }
          } else {
            // User exists in auth, but not DB. Log them out.
            await auth.signOut();
            setIsLoading(false);
          }
        } catch (error) {
           console.error("Error fetching user data, signing out.", error);
           await auth.signOut();
           setIsLoading(false);
        }
      } else {
        // User is not logged in, stop loading and show portal selection
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handlePortalClick = (role: 'admin' | 'agent') => {
    router.push(`/auth/login?role=${role}`);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115]">
        <Loader2 className="h-10 w-10 text-primary animate-spin"/>
      </div>
    );
  }

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.6,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] },
    },
    hover: {
      scale: 1.05,
      boxShadow: '0px 0px 20px rgba(234, 179, 8, 0.3)',
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115] text-white p-4">
      <div className="w-full max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-10"
        >
          <div className="flex items-center gap-4 font-bold text-4xl tracking-tighter">
            <Building2 className="text-primary h-10 w-10" />
            <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PropCall 360
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Welcome
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-muted-foreground text-lg mb-12"
        >
          Please select your portal to continue.
        </motion.p>

        <motion.div
          variants={cardContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handlePortalClick('admin')}
            className="p-1 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 cursor-pointer"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 h-full flex flex-col items-center justify-center">
              <ShieldCheck className="h-16 w-16 text-primary mb-4" />
              <h2 className="text-3xl font-bold">Admin Portal</h2>
              <p className="text-muted-foreground mt-2">
                Full access to analytics and settings.
              </p>
            </div>
          </motion.div>
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handlePortalClick('agent')}
            className="p-1 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 cursor-pointer"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 h-full flex flex-col items-center justify-center">
              <UserCheck className="h-16 w-16 text-primary mb-4" />
              <h2 className="text-3xl font-bold">Agent Portal</h2>
              <p className="text-muted-foreground mt-2">
                Manage and track your assigned leads.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
