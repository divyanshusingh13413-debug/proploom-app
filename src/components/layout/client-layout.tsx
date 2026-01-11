
'use client';
import type { PropsWithChildren } from 'react';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from './app-layout';
import SplashScreen from './splash-screen';
import { Loader2 } from 'lucide-react';

function ContentWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();
  
  // Public pages that don't need the AppLayout
  const isPublicPage = pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/chat');

  if (isPublicPage) {
    return <>{children}</>;
  }

  // All other pages are assumed to be protected and will get the AppLayout
  return <AppLayout>{children}</AppLayout>;
}

export default function ClientLayout({ children }: PropsWithChildren) {
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (sessionStorage.getItem('splashShown')) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };
  
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115]">
        <Loader2 className="h-10 w-10 text-primary animate-spin"/>
      </div>
    );
  }
  
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={usePathname()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ContentWrapper>{children}</ContentWrapper>
      </motion.div>
    </AnimatePresence>
  );
}
