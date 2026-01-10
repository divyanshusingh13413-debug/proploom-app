
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, UserCheck, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

type Portal = 'admin' | 'agent' | null;

const LoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPortal, setSelectedPortal] = useState<Portal>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<Record<string, boolean>>({ admin: false, agent: false });

  // On page load, check session storage
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
    const agentAuth = sessionStorage.getItem('agentAuthenticated') === 'true';
    setIsAuthenticated({ admin: adminAuth, agent: agentAuth });
  }, []);

  const handlePortalSelect = (portal: Portal) => {
    setSelectedPortal(portal);
  };

  const handleLogin = () => {
    const adminPass = 'Admin@Pro2026';
    const agentPass = 'Agent#786';

    if (selectedPortal === 'admin' && password === adminPass) {
      sessionStorage.setItem('adminAuthenticated', 'true');
      setIsAuthenticated(prev => ({ ...prev, admin: true }));
      router.push('/dashboard');
    } else if (selectedPortal === 'agent' && password === agentPass) {
      sessionStorage.setItem('agentAuthenticated', 'true');
      setIsAuthenticated(prev => ({ ...prev, agent: true }));
      router.push('/leads');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Incorrect password. Please try again.',
      });
    }
    setPassword('');
    setSelectedPortal(null);
  };

  const handleLogout = (portal: 'admin' | 'agent') => {
    sessionStorage.removeItem(`${portal}Authenticated`);
    setIsAuthenticated(prev => ({ ...prev, [portal]: false }));
    toast({
      title: 'Logged Out',
      description: `You have been logged out from the ${portal} portal.`,
    });
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };
  
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0px 0px 30px rgba(250, 204, 21, 0.4)',
    },
    tap: { scale: 0.95 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115] text-white p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key="role-selection"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          className="w-full max-w-4xl text-center"
        >
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
              onClick={() => isAuthenticated.admin ? router.push('/dashboard') : handlePortalSelect('admin')}
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
              onClick={() => isAuthenticated.agent ? router.push('/leads') : handlePortalSelect('agent')}
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
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedPortal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedPortal(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-sm p-8 bg-[#1a1a1a] border border-primary/20 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-center mb-2">Enter {selectedPortal === 'admin' ? 'Admin' : 'Agent'} Portal</h2>
              <p className="text-muted-foreground text-center mb-6">Please enter your password to proceed.</p>
              
              <div className="relative mb-6">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 pr-10 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-base h-12">
                Continue
              </Button>
              <Button variant="link" onClick={() => setSelectedPortal(null)} className="w-full mt-2 text-muted-foreground">
                Back to role selection
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
