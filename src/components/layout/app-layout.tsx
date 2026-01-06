'use client';
import type { PropsWithChildren } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Building2,
  LayoutDashboard,
  Users,
  Video,
  BarChart2,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AppLogo = () => (
  <div className="flex items-center gap-2.5 font-bold text-lg text-sidebar-foreground tracking-tighter">
    <Building2 className="text-secondary" />
    <span className="font-headline">PROPLOOM</span>
  </div>
);

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
              pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/')
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
  const isWhatsAppPage = pathname.startsWith('/whatsapp');

  if (isWhatsAppPage) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <AppLogo />
              <SidebarTrigger className="text-sidebar-foreground hover:text-secondary" />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Nav />
          </SidebarContent>
        </Sidebar>
      <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-end border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-4">
            </div>
          </header>
        <main
          className="flex-1 p-4 sm:p-6"
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
