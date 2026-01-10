
'use client';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './splash-screen';
import AppLayout from './app-layout';

function ContentWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();

  // The login page is the root page now
  const isLoginPage = pathname === '/';
  
  // These are other public pages that don't need the AppLayout
  const isPublicPage = pathname.startsWith('/auth') || pathname.startsWith('/chat');

  if (isLoginPage || isPublicPage) {
    return <>{children}</>;
  }

  // All other pages are assumed to be protected and will get the AppLayout
  return <AppLayout>{children}</AppLayout>;
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
            <ContentWrapper>{children}</ContentWrapper>
          </motion.div>
        )}
      </AnimatePresence>
  );
}
