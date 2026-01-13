
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
  Users2,
  PanelLeft,
  LogOut
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
import { Avatar, AvatarFallback } from '../ui/avatar';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard', roles: ['admin'] },
  { href: '/leads', icon: Users, label: 'Leads', roles: ['admin', 'agent'] },
  { href: '/sales', icon: TrendingUp, label: 'Sales Pipeline', roles: ['admin'] },
  { href: '/tours', icon: Video, label: 'Virtual Tours', roles: ['admin'] },
  { href: '/agents', icon: Users2, label: 'Manage Agents', roles: ['admin'] },
  { href: '/whatsapp', icon: MessageSquare, label: 'WhatsApp', roles: ['admin', 'agent'] },
];

const Nav = ({ isCollapsed, userRole }: { isCollapsed: boolean, userRole: string | null }) => {
  const pathname = usePathname();

  if (!userRole) return null; // Don't render nav if role is not determined yet

  const visibleNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex flex-col items-stretch gap-2 px-2">
        {visibleNavItems.map((item) => {
          const isActive = (item.href === '/dashboard' && pathname === '/dashboard') || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center justify-start h-10 rounded-lg transition-all duration-300 group',
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold shadow-lg'
                      : 'bg-card/50 hover:bg-card text-card-foreground border border-transparent hover:border-border',
                    isCollapsed ? 'w-10 justify-center' : 'w-44 px-3'
                  )}
                >
                  <item.icon className={cn('h-5 w-5 shrink-0', !isCollapsed && 'mr-3')} />
                  {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto', transition: { duration: 0.2, delay: 0.1 } }}
                        exit={{ opacity: 0, width: 0, transition: { duration: 0.1 } }}
                        className="overflow-hidden whitespace-nowrap text-sm font-medium"
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
        // Use sessionStorage first for faster loads on navigation
        const cachedRole = sessionStorage.getItem('userRole');
        const cachedName = sessionStorage.getItem('displayName');
        if (cachedRole) {
          setUserRole(cachedRole);
          setDisplayName(cachedName);
        }

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;
          const name = userData.displayName || 'User';
          
          // Update state and session storage with fresh data
          setUserRole(role);
          setDisplayName(name);
          sessionStorage.setItem('userRole', role);
          sessionStorage.setItem('userId', user.uid);
          sessionStorage.setItem('displayName', name);

          if (userData.isFirstLogin) {
              router.replace('/auth/set-password');
              setIsLoading(false);
              return;
          }

          // Role-based route protection
          const adminOnlyPages = ['/dashboard', '/agents', '/tours', '/sales'];
          if (role === 'agent' && adminOnlyPages.some(p => pathname.startsWith(p))) {
            toast({
              variant: "destructive",
              title: "Access Denied",
              description: "You do not have permission to view this page.",
            });
            router.replace('/leads');
          }
        } else {
          // User exists in Auth but not in Firestore, critical error.
          toast({ variant: 'destructive', title: "Configuration Error", description: "User profile not found in database."})
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
  
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-background">
        <div className="content-glow w-full h-[calc(100vh-2rem)]">
            <div className="relative z-10 h-full w-full rounded-2xl bg-card text-card-foreground p-4 flex gap-4">
                
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={cn("flex flex-col justify-between py-4 bg-background rounded-xl border", isSidebarCollapsed ? 'w-[68px]' : 'w-56')}
                >
                  <div>
                    <div className={cn("flex items-center justify-between mb-6", isSidebarCollapsed ? 'px-[1.1rem]' : 'px-4')}>
                       <Link href={userRole === 'admin' ? '/dashboard' : '/leads'} className={cn(isSidebarCollapsed && 'hidden')}>
                          <Building2 className="h-7 w-7 text-primary" />
                       </Link>
                       <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="h-8 w-8">
                        <PanelLeft className="h-5 w-5" />
                      </Button>
                    </div>
                    <Nav isCollapsed={isSidebarCollapsed} userRole={userRole} />
                  </div>
                  
                  <div className={cn("border-t pt-4 mx-2", isSidebarCollapsed ? "px-0" : "px-2")}>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <Button variant="ghost" onClick={handleLogout} className={cn('w-full flex justify-start h-10', isSidebarCollapsed && 'justify-center')}>
                                <LogOut className={cn('h-5 w-5 shrink-0', !isSidebarCollapsed && 'mr-3')}/>
                                {!isSidebarCollapsed && 'Logout'}
                             </Button>
                          </TooltipTrigger>
                          {isSidebarCollapsed && <TooltipContent side="right">Logout</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                  </div>
                </motion.div>

                <main className="flex-1 flex flex-col">
                  <header className="flex items-center justify-between font-bold text-lg text-foreground tracking-tighter mb-4">
                    <div className="flex items-center gap-2.5">
                       <h1 className="text-2xl font-bold tracking-tight">
                        {navItems.find(item => pathname.startsWith(item.href))?.label || 'Proploom'}
                       </h1>
                    </div>
                    <div className="flex items-center gap-4">
                      {displayName && (
                        <div className="text-right">
                          <div className="text-sm font-bold capitalize">
                            {displayName}
                          </div>
                           <div className="text-xs text-muted-foreground font-medium capitalize">
                            {userRole}
                          </div>
                        </div>
                      )}
                      <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </header>
                  
                  <div className="flex-1 overflow-y-auto gold-scrollbar pr-4 -mr-4">
                    {children}
                  </div>
                </main>
            </div>
        </div>
        <div className="absolute bottom-6 right-6 text-primary/50">
            <Sparkles className="h-8 w-8" />
        </div>
    </div>
  );
}
