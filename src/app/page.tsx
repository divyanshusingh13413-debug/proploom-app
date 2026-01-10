
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Key, ShieldCheck, UserCheck, LogOut, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Role = 'admin' | 'agent' | null;

const LoginPage = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleSelect = (role: Role) => {
    setError('');
    setPassword('');
    setSelectedRole(role);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const isAdmin = selectedRole === 'admin' && password === 'Admin@Pro2026';
    const isAgent = selectedRole === 'agent' && password === 'Agent#786';

    if (isAdmin) {
      router.push('/dashboard');
    } else if (isAgent) {
      router.push('/leads');
    } else {
      setError('Incorrect password. Please try again.');
    }
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

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115] text-white p-4">
      <AnimatePresence mode="wait">
        {!selectedRole ? (
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
                onClick={() => handleRoleSelect('admin')}
                className="p-1 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary/50 cursor-pointer"
              >
                <div className="bg-[#1a1a1a] rounded-xl p-8 h-full flex flex-col items-center justify-center">
                  <ShieldCheck className="h-16 w-16 text-primary mb-4" />
                  <h2 className="text-3xl font-bold">Admin Portal</h2>
                  <p className="text-muted-foreground mt-2">Full access to analytics and settings.</p>
                </div>
              </motion.div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleRoleSelect('agent')}
                className="p-1 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary/50 cursor-pointer"
              >
                <div className="bg-[#1a1a1a] rounded-xl p-8 h-full flex flex-col items-center justify-center">
                  <UserCheck className="h-16 w-16 text-primary mb-4" />
                  <h2 className="text-3xl font-bold">Agent Portal</h2>
                  <p className="text-muted-foreground mt-2">Manage and track your assigned leads.</p>
                </div>
              </motion.div>
            </div>
            
            <Button variant="ghost" onClick={() => {}} className="mt-12 text-muted-foreground hover:text-white invisible">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
            
          </motion.div>
        ) : (
          <motion.div
            key="password-entry"
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            className="w-full max-w-md"
          >
            <div className="bg-card/80 backdrop-blur-lg rounded-2xl border border-border/50 shadow-2xl p-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2.5 font-bold text-2xl text-foreground tracking-tighter">
                  <Building2 className="text-primary" />
                  <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PROPLOOM</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">
                  Enter {selectedRole === 'admin' ? 'Admin' : 'Agent'} Portal
              </h2>
              <p className="text-muted-foreground mb-8">Please enter your password to proceed.</p>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 h-14 pl-12 pr-10 text-lg"
                      />
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground"
                      >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                  </div>
                  {error && <p className="text-destructive text-sm">{error}</p>}
                  <Button type="submit" className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
                      Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
              </form>

              <Button variant="link" onClick={() => handleRoleSelect(null)} className="mt-6 text-muted-foreground">
                Back to role selection
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
