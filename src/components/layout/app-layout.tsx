
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
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/firebase/provider';
import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useToast } from '../ui/use-toast';

const AppLogo = () => (
  <div className="flex items-center gap-2.5 font-bold text-lg text-sidebar-foreground tracking-tighter">
    <Building2 className="text-primary" />
    <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PROPLOOM</span>
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
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged out successfully.' });
      router.push('/auth/login');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Logout failed. Please try again.' });
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }


  if (pathname.startsWith('/chat/')) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <AppLogo />
              <SidebarTrigger className="text-sidebar-foreground hover:text-primary" />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Nav />
          </SidebarContent>
          <SidebarContent className="!flex-1 justify-end">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/50 bg-background/50 px-4 backdrop-blur-md sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-4 ml-auto">
               <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className='bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold'>
                    {getInitials(user?.displayName)}
                  </AvatarFallback>
                </Avatar>
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
