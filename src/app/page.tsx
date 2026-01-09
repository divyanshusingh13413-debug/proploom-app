
'use client';

import React from 'react';
import { 
  Users, TrendingUp, Video, Building2
} from 'lucide-react';
import Link from 'next/link';

const DashboardPage = () => {

  const stats = [
    { label: 'Active Leads', value: '128', growth: '+12%', icon: Users },
    { label: 'Sales', value: '$4.2M', growth: '+8%', icon: TrendingUp },
    { label: 'Virtual Tours', value: '45', growth: '+25%', icon: Video },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2.5 font-bold text-lg text-foreground tracking-tighter">
        <Building2 className="text-primary" />
        <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PROPLOOM</span>
      </div>

       <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Here's a snapshot of your real estate activities.
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* LEADS & REMINDERS SECTION */}
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
  );
};

export default DashboardPage;
