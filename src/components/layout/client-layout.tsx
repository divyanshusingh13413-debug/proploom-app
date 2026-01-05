
'use client';
import type { PropsWithChildren } from 'react';
import AppLayout from '@/components/layout/app-layout';
import { FirebaseProvider } from '@/firebase/provider';

export default function ClientLayout({ children }: PropsWithChildren) {
  return (
    <FirebaseProvider>
      <AppLayout>{children}</AppLayout>
    </FirebaseProvider>
  );
}
