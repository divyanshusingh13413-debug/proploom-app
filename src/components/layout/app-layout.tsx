
'use client';
import type { PropsWithChildren } from 'react';
import {
  Sparkles,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  
  if (pathname.startsWith('/chat/')) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        <div className="content-glow w-full h-[calc(100vh-2rem)]">
            <div className="relative z-10 h-full w-full rounded-lg bg-card text-card-foreground p-6 flex">
              {children}
            </div>
        </div>
        <div className="absolute bottom-6 right-6 text-primary/50">
            <Sparkles className="h-8 w-8" />
        </div>
    </div>
  );
}
