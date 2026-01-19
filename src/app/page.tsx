'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
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
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        // User is signed in. Fetch their document to check role.
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // As requested, logging the role from Firestore.
            // The data model uses a string for 'role' ('admin' or 'agent').
            console.log('Current User Role:', userData.role);

            // Based on the fetched role, redirect to the correct dashboard.
            if (userData.role === 'admin') {
              router.replace('/dashboard');
            } else if (userData.role === 'agent') {
              router.replace('/leads');
            } else {
              // If role is undefined, sign out for safety.
              console.error("Unrecognized role, signing out:", userData.role);
              await auth.signOut();
              setIsLoading(false);
            }
          } else {
            // User exists in Auth, but not in Firestore DB. Sign them out.
            console.warn(`User document for ${user.uid} not found. Signing out.`);
            await auth.signOut();
            setIsLoading(false);
          }
        } catch (error) {
          // This is where "Permission Denied" would be caught.
          console.error("Error fetching user data (check Firestore rules):", error);
          // Sign out the user as we can't verify their role.
          await auth.signOut();
          setIsLoading(false);
        }
      } else {
        // No user is signed in. Stop loading and show the portal selection.
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115]">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  const handlePortalClick = (role: 'admin' | 'agent') => {
    router.push(`/auth/login?role=${role}`);
  };

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
            onClick={() => handlePortalClick('admin')}
            className="portal-card active-gold flex flex-col items-center justify-center"
          >
            <ShieldCheck className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-3xl font-bold">Admin Portal</h2>
            <p className="text-muted-foreground mt-2">
              Full access to analytics and settings.
            </p>
          </motion.div>
          <motion.div
            variants={cardVariants}
            onClick={() => handlePortalClick('agent')}
            className="portal-card active-gold flex flex-col items-center justify-center"
          >
            <UserCheck className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-3xl font-bold">Agent Portal</h2>
            <p className="text-muted-foreground mt-2">
              Manage and track your assigned leads.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
