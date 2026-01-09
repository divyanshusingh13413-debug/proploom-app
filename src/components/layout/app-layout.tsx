
'use client';
import type { PropsWithChildren } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Building2,
  LayoutDashboard,
  Users,
  Video,
  BarChart2,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/firebase/provider';

const Nav = () => {
  const pathname = usePathname();
  const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/leads', icon: Users, label: 'Leads' },
    { href: '/whatsapp', icon: MessageSquare, label: 'WhatsApp' },
    { href: '/tours', icon: Video, label: 'Virtual Tours' },
    { href: '/sales', icon: BarChart2, label: 'Sales' },
  ];

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={
              (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href))
            }
          >
            <Link href={item.href}>
              <item.icon />
              {item.label}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default function AppLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  if (pathname.startsWith('/chat/')) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="h-20" />
          <SidebarContent>
            <Nav />
          </SidebarContent>
        </Sidebar>
      <SidebarInset>
        <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
          <div className="content-glow w-full h-[calc(100vh-2rem)]">
              <div className="relative z-10 h-full w-full rounded-lg bg-card text-card-foreground p-6 overflow-y-auto gold-scrollbar">
                {children}
              </div>
          </div>
          <div className="absolute bottom-6 right-6 text-primary/50">
            <Sparkles className="h-8 w-8" />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
