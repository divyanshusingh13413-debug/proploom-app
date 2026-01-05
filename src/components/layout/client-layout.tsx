
'use client';
import { useState, useEffect, type PropsWithChildren } from 'react';
import AppLayout from '@/components/layout/app-layout';
import { FirebaseProvider } from '@/firebase/provider';
import SplashScreen from '@/components/layout/splash-screen';

export default function ClientLayout({ children }: PropsWithChildren) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Same duration as the splash screen animations

    return () => clearTimeout(timer);
  }, []);

  return (
    <FirebaseProvider>
      {showSplash && <SplashScreen />}
      <div className={showSplash ? 'hidden' : ''}>
        <AppLayout>{children}</AppLayout>
      </div>
    </FirebaseProvider>
  );
}
