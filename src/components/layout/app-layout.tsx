
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
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '../ui/use-toast';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

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
  const { toast } = useToast();
  
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;
          
          setUserRole(role);
          setDisplayName(userData.displayName || 'User');
          sessionStorage.setItem('userRole', role);
          sessionStorage.setItem('userId', user.uid);
          sessionStorage.setItem('displayName', userData.displayName || 'User');

          if (userData.isFirstLogin) {
              router.replace('/auth/set-password');
              return; // Stop further execution until password is set
          }

          // Role-based route protection
          const adminPages = ['/dashboard', '/agents', '/tours', '/sales'];
          if (role === 'agent' && adminPages.includes(pathname)) {
            toast({
              variant: "destructive",
              title: "Access Denied",
              description: "You do not have permission to view this page.",
            });
            router.replace('/leads');
          }
        } else {
          // User exists in Auth but not in Firestore, treat as unauthenticated
          handleLogout();
        }
      } else {
        // No user logged in
        router.replace('/');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router, toast]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      sessionStorage.clear();
      toast({
        title: 'Logged Out',
        description: `You have been successfully logged out.`,
      });
      router.replace('/');
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-card">
        <Loader2 className="h-10 w-10 text-primary animate-spin"/>
      </div>
    );
  }
  
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="content-glow w-full h-[calc(100vh-2rem)]">
            <div className="relative z-10 h-full w-full rounded-lg bg-card text-card-foreground p-6 flex">
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex flex-col justify-center"
                >
                  <Nav isCollapsed={isSidebarCollapsed} userRole={userRole} />
                </motion.div>

                <motion.div layout className="flex-1 flex flex-col pl-6">
                  <header className="flex items-center justify-between font-bold text-lg text-foreground tracking-tighter mb-6">
                    <div className="flex items-center gap-2.5">
                      <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="h-8 w-8">
                        <PanelLeft className="h-5 w-5" />
                      </Button>
                      <Link href={userRole === 'admin' ? '/dashboard' : '/leads'} className="flex items-center gap-2.5">
                        <Building2 className="text-primary" />
                        <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PROPLOOM</span>
                      </Link>
                    </div>
                    <div className="flex items-center gap-4">
                      {displayName && (
                        <div className="text-sm font-medium capitalize">
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
