
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, UserCheck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';

const LoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<Record<string, boolean>>({ admin: false, agent: false });

  // On page load, check session storage
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
    const agentAuth = sessionStorage.getItem('agentAuthenticated') === 'true';
    setIsAuthenticated({ admin: adminAuth, agent: agentAuth });
  }, []);

  const handleLogout = async (portal: 'admin' | 'agent') => {
    try {
      await signOut(auth);
      sessionStorage.removeItem(`${portal}Authenticated`);
      setIsAuthenticated(prev => ({ ...prev, [portal]: false }));
      toast({
        title: 'Logged Out',
        description: `You have been logged out from the ${portal} portal.`,
      });
      // Ensure we are at the root page after logout
      router.push('/');
    } catch (error) {
      console.error("Logout failed: ", error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  const handlePortalClick = (portal: 'admin' | 'agent') => {
    if (isAuthenticated[portal]) {
      const destination = portal === 'admin' ? '/dashboard' : '/leads';
      router.push(destination);
    } else {
      router.push('/auth/login');
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0px 0px 30px rgba(250, 204, 21, 0.4)',
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115] text-white p-4">
      <div className="w-full max-w-4xl text-center">
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4 font-bold text-4xl tracking-tighter">
            <Building2 className="text-primary h-10 w-10" />
            <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PROPLOOM
            </span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome</h1>
        <p className="text-muted-foreground text-lg mb-12">Please select your portal to continue.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handlePortalClick('admin')}
            className="p-1 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary/50 cursor-pointer"
          >
            <div className="bg-[#1a1a1a] rounded-xl p-8 h-full flex flex-col items-center justify-center">
              <ShieldCheck className="h-16 w-16 text-primary mb-4" />
              <h2 className="text-3xl font-bold">Admin Portal</h2>
              <p className="text-muted-foreground mt-2">Full access to analytics and settings.</p>
              {isAuthenticated.admin && <Button size="sm" variant="destructive" className="mt-4" onClick={(e) => {e.stopPropagation(); handleLogout('admin')}}>Logout</Button>}
            </div>
          </motion.div>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handlePortalClick('agent')}
            className="p-1 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary/50 cursor-pointer"
          >
            <div className="bg-[#1a1a1a] rounded-xl p-8 h-full flex flex-col items-center justify-center">
              <UserCheck className="h-16 w-16 text-primary mb-4" />
              <h2 className="text-3xl font-bold">Agent Portal</h2>
              <p className="text-muted-foreground mt-2">Manage and track your assigned leads.</p>
              {isAuthenticated.agent && <Button size="sm" variant="destructive" className="mt-4" onClick={(e) => {e.stopPropagation(); handleLogout('agent')}}>Logout</Button>}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
