'use client';
import type { PropsWithChildren } from 'react';
import {
  Building2,
  Home,
  Users,
  Video,
  BarChart2,
  Sparkles,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Nav = () => {
  const pathname = usePathname();
  const navItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/leads', icon: Clock, label: 'Leads' },
    { href: '/tours', icon: Video, label: 'Virtual Tour' },
    { href: '/sales', icon: BarChart2, label: 'Sales' },
  ];

  return (
    <nav className="flex flex-col items-end space-y-3">
      {navItems.map((item) => {
        const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center justify-start w-48 py-3 px-4 rounded-xl transition-all duration-300',
              isActive
                ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold shadow-lg'
                : 'bg-card/50 hover:bg-card text-card-foreground border border-border'
            )}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};


export default function AppLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  
  if (pathname.startsWith('/chat/')) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        <div className="content-glow w-full h-[calc(100vh-2rem)]">
            <div className="relative z-10 h-full w-full rounded-lg bg-card text-card-foreground p-6 flex">
                <div className="flex-1 overflow-y-auto gold-scrollbar pr-6">
                    <div className="flex items-center gap-2.5 font-bold text-lg text-foreground tracking-tighter mb-6">
                        <Building2 className="text-primary" />
                        <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PROPLOOM</span>
                    </div>
                    {children}
                </div>
                <div className="w-48 flex flex-col justify-center">
                    <Nav />
                </div>
            </div>
        </div>
        <div className="absolute bottom-6 right-6 text-primary/50">
            <Sparkles className="h-8 w-8" />
        </div>
    </div>
  );
}
