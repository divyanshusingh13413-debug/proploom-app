'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, BadgeDollarSign, MapPin, BarChart3, MessageSquare, LogOut } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = sessionStorage.getItem('userRole');
    setRole(savedRole);
  }, []);

  const allLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin'] },
    { name: 'Leads', path: '/leads', icon: <Users size={20} />, roles: ['admin', 'agent'] },
    { name: 'Sales Pipeline', path: '/sales', icon: <BadgeDollarSign size={20} />, roles: ['admin'] },
    { name: 'Site Visits', path: '/tours', icon: <MapPin size={20} />, roles: ['admin'] },
    { name: 'AI Analytics', path: '/analytics', icon: <BarChart3 size={20} />, roles: ['admin'] },
    { name: 'WhatsApp', path: '/whatsapp', icon: <MessageSquare size={20} />, roles: ['admin', 'agent'] },
  ];

  const filteredLinks = allLinks.filter(link => link.roles.includes(role || ''));

  return (
    <div className="w-64 bg-[#0F1115] border-r border-zinc-800 h-screen p-4 flex flex-col fixed left-0 top-0">
      <div className="mb-10 px-2 text-yellow-500 font-bold text-xl tracking-tighter">
        PROPLOOM <span className="text-white text-xs block">ENTERPRISE AI</span>
      </div>

      <nav className="space-y-1 flex-1">
        {filteredLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === link.path 
                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' 
                : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
          >
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
        <div className="px-4 py-2 bg-zinc-900/50 rounded-lg">
          <p className="text-[10px] uppercase text-zinc-500 font-bold">Logged in as</p>
          <p className="text-sm text-yellow-500 capitalize font-medium">{role || 'User'}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;