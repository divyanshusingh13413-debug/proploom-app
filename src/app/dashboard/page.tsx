
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Video, 
  Plus,
  MessageSquare,
  Loader2,
  Home,
  Users2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Lead } from '@/lib/types';
import { db } from '@/firebase/config';
import { collection, onSnapshot, query, orderBy, limit, where } from 'firebase/firestore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardPage = () => {
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  
  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    const uid = sessionStorage.getItem('userId');

    if (!role || !uid) {
      setLeadsLoading(false);
      return;
    }

    let leadsQuery;
    if (role === 'admin') {
      leadsQuery = query(collection(db, "leads"), orderBy("timestamp", "desc"), limit(5));
    } else {
      // Agent's view: only their own leads. This might require a composite index in Firestore.
      leadsQuery = query(collection(db, "leads"), where("assignedAgentId", "==", uid), orderBy("timestamp", "desc"), limit(5));
    }

    const unsubscribeLeads = onSnapshot(leadsQuery, (querySnapshot) => {
      const leadsData: Lead[] = [];
      querySnapshot.forEach((doc) => {
        leadsData.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setRecentLeads(leadsData);
      setLeadsLoading(false);
    }, (error) => {
      console.error("Dashboard: Error fetching leads:", error);
      setLeadsLoading(false);
    });

    return () => unsubscribeLeads();
  }, []);
  
  const stats = [
    { label: 'Active Leads', value: '128', growth: '+12%', icon: Users },
    { label: 'Sales', value: '$4.2M', growth: '+8%', icon: TrendingUp },
    { label: 'Virtual Tours', value: '45', growth: '+25%', icon: Video },
  ];

  const handleWhatsAppChat = (phone: string, name?: string) => {
    const message = name
      ? `Hi ${name}, I am calling from Proploom. Are you still interested in the property?`
      : 'Hello, I am interested in your property listing.';
    const encodedMessage = encodeURIComponent(message);
    const cleanedPhone = phone.replace(/[\s+-]/g, '');
    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
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
              <div className="flex flex-col gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
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
                <Button variant="link" size="sm" className="text-xs p-0 h-auto">Details</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
