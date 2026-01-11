
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Video, 
  Building2,
  Home,
  MessageSquare,
  Clock,
  PanelLeft,
  Plus,
  Loader2
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Lead } from '@/lib/types';
import { db, auth } from '@/firebase/config';
import { collection, onSnapshot, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { onAuthStateChanged } from 'firebase/auth';


const Nav = ({ isCollapsed, userRole }: { isCollapsed: boolean, userRole: string | null }) => {
  const pathname = usePathname();
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard', roles: ['admin', 'agent'] },
    { href: '/leads', icon: Clock, label: 'Leads', roles: ['admin', 'agent'] },
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


const DashboardPage = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setDisplayName(user.displayName);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        // Handle user not logged in
        setDisplayName(null);
        setUserRole(null);
      }
    });

    const q = query(collection(db, "leads"), orderBy("timestamp", "desc"), limit(5));
    const unsubscribeLeads = onSnapshot(q, (querySnapshot) => {
      const leadsData: Lead[] = [];
      querySnapshot.forEach((doc) => {
        leadsData.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setRecentLeads(leadsData);
      setLeadsLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeLeads();
    };
  }, []);
  
  const stats = [
    { label: 'Active Leads', value: '128', growth: '+12%', icon: Users },
    { label: 'Sales', value: '$4.2M', growth: '+8%', icon: TrendingUp },
    { label: 'Virtual Tours', value: '45', growth: '+25%', icon: Video },
  ];

  const handleWhatsAppChat = (phone: string, name: string) => {
    const message = `Hello ${name}, I am reaching out from Proploom regarding your property inquiry.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex w-full h-full">
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
        <div className="flex items-center justify-between font-bold text-lg text-foreground tracking-tighter mb-6">
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="h-8 w-8">
              <PanelLeft className="h-5 w-5" />
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <Building2 className="text-primary" />
              <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PROPLOOM</span>
            </Link>
          </div>
          {displayName && (
            <div className="text-sm font-medium">
              Hello, {displayName}
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto gold-scrollbar pr-6">
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-muted-foreground">
                Here's a snapshot of your real estate activities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-background p-6 rounded-2xl border border-border/50 transition-all hover:border-primary/50 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <h3 className="text-2xl font-bold mt-1 text-foreground">{stat.value}</h3>
                      <span className="text-green-400 text-xs font-medium">{stat.growth} from last month</span>
                    </div>
                    <stat.icon className="text-primary" size={24} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-background p-6 rounded-2xl border border-border/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-foreground">Recent Leads</h3>
                   <Link href="/leads/new">
                      <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2"/>
                          Add Lead
                      </Button>
                  </Link>
                </div>
                
                 {leadsLoading ? (
                  <div className="flex justify-center items-center h-full min-h-[200px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : recentLeads.length > 0 ? (
                  <div className="space-y-4">
                    {recentLeads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border/50">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                              {lead.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-foreground">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{lead.propertyName}</p>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleWhatsAppChat(lead.phone, lead.name)}
                          className="text-green-500 hover:bg-green-500/10 hover:text-green-400 h-8 w-8"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[200px]">
                    <Link href="/leads/new" className='w-full'>
                      <Button variant="outline" className="h-auto py-4 w-full border-dashed border-2 hover:bg-muted/50 hover:border-solid">
                          <Plus className="h-5 w-5 mr-2 text-muted-foreground"/>
                          <span className="text-muted-foreground">Add Your First Lead</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </div>


              <div className="bg-background p-6 rounded-2xl border border-border/50">
                <h3 className="text-lg font-bold mb-4 text-foreground">Reminders</h3>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50">
                      <div>
                        <p className="font-medium text-sm text-foreground">Follow-up with Client {i}</p>
                        <p className="text-xs text-muted-foreground">Call scheduled for 3:00 PM</p>
                      </div>
                      <button className="text-xs text-primary font-semibold hover:underline">Details</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
