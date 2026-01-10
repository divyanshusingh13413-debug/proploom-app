
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
      const isRoleSelectionPage = pathname === '/';

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
  const isRoleSelectionPage = pathname === '/';

  // If user is not logged in and not on an auth page, redirecting...
  if (!user && !isAuthPage) {
    return null; 
  }
  
  // If user is logged in and on an auth page, redirecting...
  if (user && isAuthPage) {
    return null;
  }

  // If user is logged in and on a page other than role selection, wrap with AppLayout
  if (user && !isRoleSelectionPage) {
    return <AppLayout>{children}</AppLayout>
  }
  
  // For role selection page or auth pages, render children directly
  return <>{children}</>;
}


export default function ClientLayout({ children }: PropsWithChildren) {
  const [showSplash, setShowSplash] = useState(true);

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
