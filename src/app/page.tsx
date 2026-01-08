
'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, Video, 
  TrendingUp, Menu, X, Bell, User 
} from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#0f1115] text-gray-100 flex">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-[#161920] border-r border-gray-800 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="text-xl font-bold bg-gradient-to-r from-gold-500 to-yellow-200 bg-clip-text text-transparent">PROPLOOM</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-800 rounded-lg">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link href={item.href} key={item.label}>
              <div className="flex items-center p-3 cursor-pointer hover:bg-gray-800 rounded-xl transition-colors group">
                <item.icon className="text-gray-400 group-hover:text-yellow-500" size={22} />
                {isSidebarOpen && <span className="ml-4 font-medium">{item.label}</span>}
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-gray-800 bg-[#161920]/50 backdrop-blur-md flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-gray-300">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-gray-400 cursor-pointer" />
            <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
              DS
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#161920] p-6 rounded-2xl border border-gray-800 hover:border-yellow-500/50 transition-all shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    <span className="text-green-400 text-xs font-medium">{stat.growth} from last month</span>
                  </div>
                  <stat.icon className="text-yellow-500" size={24} />
                </div>
              </div>
            ))}
          </div>

          {/* LEADS & REMINDERS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#161920] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-bold mb-4">Recent Leads</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#0f1115] rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full" />
                      <div>
                        <p className="font-medium text-sm text-gray-200">Lead Person {i}</p>
                        <p className="text-xs text-gray-500 italic">Viewed "The Imperial" 2h ago</p>
                      </div>
                    </div>
                    <button className="text-xs text-yellow-500 font-semibold hover:underline">Suggest</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
