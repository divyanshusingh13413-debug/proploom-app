
'use client';
import type { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from './app-layout';
import SplashScreen from './splash-screen';
import { useState, useEffect } from 'react';

function ContentWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();
  
  // Public pages that don't need the AppLayout
  const isPublicPage = pathname === '/';

  if (isPublicPage) {
    return <>{children}</>;
  }

  // All other pages are assumed to be protected and will get the AppLayout
  return <AppLayout>{children}</AppLayout>;
}

export default function ClientLayout({ children }: PropsWithChildren) {
  const [showSplash, setShowSplash] = useState(true);

  // This effect will only run once on the client, after the component mounts.
  useEffect(() => {
    if (sessionStorage.getItem('splashShown')) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };
  
  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onFinish={handleSplashFinish} />
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
