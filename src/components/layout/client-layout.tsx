
'use client';
import type { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from './app-layout';

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
  return (
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
  );
}
