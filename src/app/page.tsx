
'use client';

import React, { useState } from 'react';
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
  PanelLeft
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Nav = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const pathname = usePathname();
  const navItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/leads', icon: Clock, label: 'Leads' },
    { href: '/whatsapp', icon: MessageSquare, label: 'WhatsApp' },
    { href: '/tours', icon: Video, label: 'Virtual Tour' },
    { href: '/sales', icon: TrendingUp, label: 'Sales' },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex flex-col items-stretch space-y-3 px-4">
        {navItems.map((item) => {
          const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
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
                        className="overflow-hidden"
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
  
  const stats = [
    { label: 'Active Leads', value: '128', growth: '+12%', icon: Users },
    { label: 'Sales', value: '$4.2M', growth: '+8%', icon: TrendingUp },
    { label: 'Virtual Tours', value: '45', growth: '+25%', icon: Video },
  ];

  return (
    <div className="flex w-full h-full">
      {/* Sidebar */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col justify-center"
      >
        <Nav isCollapsed={isSidebarCollapsed} />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pl-6">
        <div className="flex items-center gap-2.5 font-bold text-lg text-foreground tracking-tighter mb-6">
          <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="h-8 w-8">
            <PanelLeft className="h-5 w-5" />
          </Button>
          <Building2 className="text-primary" />
          <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PROPLOOM</span>
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
                <h3 className="text-lg font-bold mb-4 text-foreground">Recent Leads</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full" />
                        <div>
                          <p className="font-medium text-sm text-foreground">Lead Person {i}</p>
                          <p className="text-xs text-muted-foreground italic">Viewed "The Imperial" 2h ago</p>
                        </div>
                      </div>
                      <Link href="/leads">
                        <button className="text-xs text-primary font-semibold hover:underline">Suggest</button>
                      </Link>
                    </div>
                  ))}
                </div>
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
      </div>
    </div>
  );
};

export default DashboardPage;
