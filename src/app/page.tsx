
'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, Video, 
  TrendingUp, Menu, X, Bell, User 
} from 'lucide-react';
import Link from 'next/link';
import AppLayout from '@/components/layout/app-layout';

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { label: 'Active Leads', value: '128', growth: '+12%', icon: Users },
    { label: 'Sales', value: '$4.2M', growth: '+8%', icon: TrendingUp },
    { label: 'Virtual Tours', value: '45', growth: '+25%', icon: Video },
  ];

  const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Overview' },
    { href: '/leads', icon: Users, label: 'Leads' },
    { href: '/whatsapp', icon: MessageSquare, label: 'WhatsApp' },
    { href: '/tours', icon: Video, label: 'Virtual Tours' },
    { href: '/sales', icon: TrendingUp, label: 'Sales' },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card p-6 rounded-2xl border border-border hover:border-primary/20 transition-all shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <span className="text-green-400 text-xs font-medium">{stat.growth} from last month</span>
                </div>
                <stat.icon className="text-secondary" size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* LEADS & REMINDERS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border">
            <h3 className="text-lg font-bold mb-4">Recent Leads</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full" />
                    <div>
                      <p className="font-medium text-sm text-foreground">Lead Person {i}</p>
                      <p className="text-xs text-muted-foreground italic">Viewed "The Imperial" 2h ago</p>
                    </div>
                  </div>
                  <button className="text-xs text-secondary font-semibold hover:underline">Suggest</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
