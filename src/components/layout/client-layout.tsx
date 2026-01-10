
'use client';
import type { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './splash-screen';
import AppLayout from './app-layout';
import { FirebaseProvider } from '@/firebase/provider'; // Restored for auth state management

function ContentWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();
  
  // Public pages that don't need the AppLayout
  const isPublicPage = pathname === '/' || pathname.startsWith('/auth');

  if (isPublicPage) {
    return <>{children}</>;
  }

  // All other pages are assumed to be protected and will get the AppLayout
  return <AppLayout>{children}</AppLayout>;
}

export default function ClientLayout({ children }: PropsWithChildren) {
  // For simplicity, we are removing the splash screen for now to focus on the auth flow.
  // You can re-enable it by wrapping the content in the AnimatePresence logic.
  
  return (
    <FirebaseProvider>
        <AnimatePresence mode="wait">
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ContentWrapper>{children}</ContentWrapper>
          </motion.div>
        </AnimatePresence>
    </FirebaseProvider>
  );
}
