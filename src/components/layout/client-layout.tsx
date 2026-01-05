
'use client';
import { useState, useEffect, type PropsWithChildren } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AppLayout from '@/components/layout/app-layout';
import { FirebaseProvider, useAuth } from '@/firebase/provider';
import SplashScreen from '@/components/layout/splash-screen';
import { Loader2 } from 'lucide-react';

function AuthWrapper({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.push('/auth/login');
    }
  }, [user, loading, router, isAuthPage]);

  if (loading || (!user && !isAuthPage)) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}


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
        <AuthWrapper>
          <AppLayout>{children}</AppLayout>
        </AuthWrapper>
      </div>
    </FirebaseProvider>
  );
}
