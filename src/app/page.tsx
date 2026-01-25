
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type User as FirebaseAuthUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, UserCheck, Loader2, Bug } from 'lucide-react';
import SplashScreen from '@/components/layout/splash-screen';
import { Button } from '@/components/ui/button';

const debugPermissions = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.log("❌ Error: No user is logged in!");
    alert("No user is logged in. Please log in first.");
    return;
  }

  const uid = user.uid;
  console.log("🆔 Your Login UID:", uid);

  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("✅ Firestore Document Found!");
      console.log("📂 Full Data:", data);
      console.log("🔑 Roles Array:", data.roles);
      
      if (data.roles && data.roles.includes('admin')) {
        console.log("🚀 Admin Access: GRANTED");
      } else {
        console.log("⚠️ Admin Access: DENIED ('admin' not in roles array)");
      }
      alert("Debug info logged to console. Press F12 to view.");

    } else {
      console.log("❌ Error: No document found in Firestore for UID:", uid);
      console.log("💡 Tip: Make sure your Document ID in Firebase Console's 'users' collection matches the UID above exactly!");
      alert("User document not found in Firestore. Check the console (F12) for details.");
    }
  } catch (error: any) {
    console.error("🔥 Firebase Error:", error.message);
    alert(`A Firebase error occurred: ${error.message}. Check console (F12) for more details.`);
  }
};


const RoleSelectionPage = () => {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthUser | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);

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
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const roles: string[] = userData.roles || [];
            console.log('Current User Roles:', roles);
            setUserRoles(roles);
          } else {
            console.warn(`User document for ${currentUser.uid} not found. Signing out.`);
            await auth.signOut();
            setUser(null);
            setUserRoles([]);
          }
        } catch (error) {
          console.error("Error fetching user data (check Firestore rules):", error);
          await auth.signOut();
          setUser(null);
          setUserRoles([]);
        }
      } else {
        // No user is signed in.
        setUser(null);
        setUserRoles([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const isAdminAllowed = user ? userRoles.includes('admin') : true;
  const isAgentAllowed = user ? userRoles.includes('agent') : true;

  const handleAdminClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login?role=admin');
    }
  };

  const handleAgentClick = () => {
    if (user) {
      router.push('/leads');
    } else {
      router.push('/auth/login?role=agent');
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
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
          {user ? `Welcome back, ${user.displayName || 'User'}!` : 'Please select your portal to continue.'}
        </motion.p>
        
        {isLoading ? (
            <div className="flex justify-center items-center min-h-[178px]">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
          ) : (
            <motion.div
              variants={cardContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <motion.button
                variants={cardVariants}
                onClick={handleAdminClick}
                disabled={!isAdminAllowed}
                className={`portal-card text-left ${isAdminAllowed ? 'active-gold' : 'locked'}`}
              >
                <ShieldCheck className="h-16 w-16 text-primary mb-4" />
                <h2 className="text-3xl font-bold">Admin Portal</h2>
                <p className="text-muted-foreground mt-2">
                  Full access to analytics and settings.
                </p>
              </motion.button>
              <motion.button
                variants={cardVariants}
                onClick={handleAgentClick}
                disabled={!isAgentAllowed}
                className={`portal-card text-left ${isAgentAllowed ? 'active-gold' : 'locked'}`}
              >
                <UserCheck className="h-16 w-16 text-primary mb-4" />
                <h2 className="text-3xl font-bold">Agent Portal</h2>
                <p className="text-muted-foreground mt-2">
                  Manage and track your assigned leads.
                </p>
              </motion.button>
            </motion.div>
        )}

      </div>
       <div className="absolute bottom-4 right-4">
        <Button variant="ghost" onClick={debugPermissions} className="text-muted-foreground hover:text-foreground">
          <Bug className="mr-2 h-4 w-4" />
          Debug Permissions
        </Button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
