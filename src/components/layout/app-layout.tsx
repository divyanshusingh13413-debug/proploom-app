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
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '@/firebase/provider';
import { auth } from '@/firebase';

const AppLogo = () => (
  <div className="flex items-center gap-2.5 font-bold text-lg text-primary-foreground tracking-tighter">
    <Building2 className="text-accent" />
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
  const { user } = useAuth();
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    return <main>{children}</main>;
  }


  const isWhatsAppPage = pathname.startsWith('/whatsapp');

  return (
    <SidebarProvider>
      {!isWhatsAppPage && (
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <AppLogo />
              <SidebarTrigger className="text-primary-foreground hover:text-accent" />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Nav />
          </SidebarContent>
        </Sidebar>
      )}
      <SidebarInset>
        {!isWhatsAppPage && (
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              {' '}
              {/* This is a spacer */}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src="https://picsum.photos/seed/user/100/100"
                        alt="User Avatar"
                        data-ai-hint="person professional"
                      />
                      <AvatarFallback>
                        {auth.currentUser?.displayName
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {auth.currentUser?.displayName || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {auth.currentUser?.email || ''}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => auth.signOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
        )}
        <main
          className={`flex-1 ${!isWhatsAppPage ? 'p-4 sm:p-6' : ''}`}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
