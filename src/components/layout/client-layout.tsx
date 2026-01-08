
'use client';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './splash-screen';

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

  return <>{children}</>;
}


export default function ClientLayout({ children }: PropsWithChildren) {
  const [showSplash, setShowSplash] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Only show splash screen on the initial load of the root path
    if (pathname === '/' || pathname.startsWith('/auth')) {
        const timer = setTimeout(() => setShowSplash(false), 3000); // Duration of the splash animation
        return () => clearTimeout(timer);
    } else {
        setShowSplash(false);
    }
  }, [pathname]);

  return (
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div key="splash">
            <SplashScreen onAnimationComplete={() => setShowSplash(false)} />
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
