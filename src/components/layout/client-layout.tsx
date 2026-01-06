'use client';
import { useState, useEffect, type PropsWithChildren } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/app-layout';
import { FirebaseProvider, useAuth } from '@/firebase/provider';
import SplashScreen from '@/components/layout/splash-screen';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

function AuthWrapper({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!loading) {
      setInitialLoad(false);
      const isAuthPage = pathname.startsWith('/auth');
      if (!user && !isAuthPage) {
        router.push('/auth/login');
      } else if (user && isAuthPage) {
        router.push('/');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading || initialLoad) {
    const isAuthPage = pathname.startsWith('/auth');
    if (!user && !isAuthPage) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
                <Loader2 className="w-12 h-12 animate-spin text-secondary" />
            </div>
        );
    }
  }
  
  const isAuthPage = pathname.startsWith('/auth');

  if (!user && !isAuthPage) {
    return null;
  }
  
  if (user && isAuthPage) {
    return null;
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}


export default function ClientLayout({ children }: PropsWithChildren) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Same duration as the splash screen animations

    return () => clearTimeout(timer);
  }, []);

  return (
    <FirebaseProvider>
      <AnimatePresence mode="wait">
        {showSplash ? (
            <motion.div key="splash">
                <SplashScreen />
            </motion.div>
        ) : (
            <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                 <AuthWrapper>{children}</AuthWrapper>
            </motion.div>
        )}
      </AnimatePresence>
    </FirebaseProvider>
  );
}
