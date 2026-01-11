
'use client';
import type { PropsWithChildren } from 'react';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from './app-layout';
import { Loader2 } from 'lucide-react';

export default function ClientLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  // Public pages that don't need the AppLayout
  const isPublicPage = pathname === '/' || pathname.startsWith('/auth');

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115]">
        <Loader2 className="h-10 w-10 text-primary animate-spin"/>
      </div>
    );
  }

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
