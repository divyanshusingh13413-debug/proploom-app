
'use client';
import type { PropsWithChildren } from 'react';
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Users, 
  TrendingUp, 
  Video, 
  Building2,
  Home,
  MessageSquare,
  Clock,
  PanelLeft,
  Users2
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { db, auth } from '@/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import SplashScreen from './splash-screen';

const Nav = ({ isCollapsed, userRole }: { isCollapsed: boolean, userRole: string | null }) => {
  const pathname = usePathname();
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard', roles: ['admin'] },
    { href: '/leads', icon: Clock, label: 'Leads', roles: ['admin', 'agent'] },
    { href: '/agents', icon: Users2, label: 'Manage Agents', roles: ['admin'] },
    { href: '/whatsapp', icon: MessageSquare, label: 'WhatsApp', roles: ['admin', 'agent'] },
    { href: '/tours', icon: Video, label: 'Virtual Tour', roles: ['admin'] },
    { href: '/sales', icon: TrendingUp, label: 'Sales', roles: ['admin'] },
  ];

  const visibleNavItems = navItems.filter(item => userRole && item.roles.includes(userRole));

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex flex-col items-stretch space-y-3 px-4">
        {visibleNavItems.map((item) => {
          const isActive = (item.href === '/dashboard' && pathname === '/dashboard') || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center justify-start h-12 rounded-xl transition-all duration-300 group',
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold shadow-lg'
                      : 'bg-card/50 hover:bg-card text-card-foreground border border-border',
                    isCollapsed ? 'w-12 justify-center' : 'w-48 px-4'
                  )}
                >
                  <item.icon className={cn('h-5 w-5 shrink-0', !isCollapsed && 'mr-3')} />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto', transition: { duration: 0.2, delay: 0.1 } }}
                        exit={{ opacity: 0, width: 0, transition: { duration: 0.1 } }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-card text-card-foreground border-border">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
};


export default function AppLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  // Check for splash screen status on mount
  useEffect(() => {
    if (sessionStorage.getItem('splashShown')) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);
          setDisplayName(userData.displayName);

          if (userData.isFirstLogin && pathname !== '/auth/set-password') {
            router.replace('/auth/set-password');
            setIsAuthLoading(false); // Stop auth loading here
            return;
          }

          if (userData.role === 'agent') {
            sessionStorage.setItem('agentAuthenticated', 'true');
            const adminPages = ['/tours', '/sales', '/agents', '/dashboard'];
            if (adminPages.includes(pathname)) {
                router.replace('/leads');
            }
          } else if (userData.role === 'admin') {
            sessionStorage.setItem('adminAuthenticated', 'true');
          }
          
        } else {
          router.replace('/');
        }
      } else {
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('agentAuthenticated');
        if (!pathname.startsWith('/auth') && pathname !== '/') {
            router.replace('/');
        }
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('agentAuthenticated');
    router.replace('/');
  }
  
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (isAuthLoading) {
      return (
          <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115]">
              <Loader2 className="h-10 w-10 text-primary animate-spin"/>
          </div>
      )
  }

  // Render children directly for auth pages
  if (pathname.startsWith('/auth/')) {
    return <main className="flex-1">{children}</main>;
  }

  if (pathname.startsWith('/chat/')) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="content-glow w-full h-[calc(100vh-2rem)]">
            <div className="relative z-10 h-full w-full rounded-lg bg-card text-card-foreground p-6 flex">
                {/* Sidebar */}
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex flex-col justify-center"
                >
                  <Nav isCollapsed={isSidebarCollapsed} userRole={userRole} />
                </motion.div>

                {/* Main Content */}
                <motion.div layout className="flex-1 flex flex-col pl-6">
                  <header className="flex items-center justify-between font-bold text-lg text-foreground tracking-tighter mb-6">
                    <div className="flex items-center gap-2.5">
                      <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="h-8 w-8">
                        <PanelLeft className="h-5 w-5" />
                      </Button>
                      <Link href="/dashboard" className="flex items-center gap-2.5">
                        <Building2 className="text-primary" />
                        <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PROPLOOM</span>
                      </Link>
                    </div>
                    <div className="flex items-center gap-4">
                      {displayName && (
                        <div className="text-sm font-medium">
                          Hello, {displayName}
                        </div>
                      )}
                      <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
                    </div>
                  </header>
                  
                  <div className="flex-1 overflow-y-auto gold-scrollbar pr-6">
                    {children}
                  </div>
                </motion.div>
            </div>
        </div>
        <div className="absolute bottom-6 right-6 text-primary/50">
            <Sparkles className="h-8 w-8" />
        </div>
    </div>
  );
}
