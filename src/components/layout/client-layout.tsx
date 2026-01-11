
'use client';
import type { PropsWithChildren } from 'react';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from './app-layout';
import SplashScreen from './splash-screen';
import { Loader2 } from 'lucide-react';

export default function ClientLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Public pages that don't need the AppLayout
  const isPublicPage = pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/chat');

  useEffect(() => {
    setIsClient(true);
    // Check if splash has been shown in the current session
    if (sessionStorage.getItem('splashShown')) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };
  
  // While waiting for the client to mount, show a loader to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115]">
        <Loader2 className="h-10 w-10 text-primary animate-spin"/>
      </div>
    );
  }
  
  // Show splash screen on first visit of the session
  if (showSplash && isPublicPage) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Animate page transitions
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isPublicPage ? children : <AppLayout>{children}</AppLayout>}
      </motion.div>
    </AnimatePresence>
  );
}
