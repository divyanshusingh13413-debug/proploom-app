
'use client';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './splash-screen';
import AppLayout from './app-layout';

function AuthWrapper({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname.startsWith('/auth');
      if (!user && !isAuthPage) {
        router.push('/auth/login');
      } else if (user && isAuthPage) {
        router.push('/');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-secondary" />
      </div>
    );
  }
  
  const isAuthPage = pathname.startsWith('/auth');

  if (!user && !isAuthPage) {
    return null; // Show nothing while redirecting
  }
  
  if (user && isAuthPage) {
    return null; // Show nothing while redirecting
  }

  if (user) {
    return <AppLayout>{children}</AppLayout>
  }

  return <>{children}</>;
}


export default function ClientLayout({ children }: PropsWithChildren) {
  const [showSplash, setShowSplash] = useState(true);
  const pathname = usePathname();

   // Only show splash screen on the very first load of the root or auth pages
   useEffect(() => {
    const isFirstLoad = !sessionStorage.getItem('hasLoaded');
    if (isFirstLoad) {
      setShowSplash(true);
      sessionStorage.setItem('hasLoaded', 'true');
    } else {
      setShowSplash(false);
    }
  }, []);

  return (
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div key="splash">
            <SplashScreen onFinish={() => setShowSplash(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AuthWrapper>{children}</AuthWrapper>
          </motion.div>
        )}
      </AnimatePresence>
  );
}
