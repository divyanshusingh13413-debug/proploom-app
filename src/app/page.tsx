
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, UserCheck, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import SplashScreen from '@/components/layout/splash-screen';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const LoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  const [showSplash, setShowSplash] = useState(true);
  const [selectedPortal, setSelectedPortal] = useState<'admin' | 'agent' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState({ admin: false, agent: false });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

   useEffect(() => {
    // This check should only run on the client side
    if (typeof window !== 'undefined' && sessionStorage.getItem('splashShown')) {
      setShowSplash(false);
    } else {
      // If it's the first visit, ensure splash is shown and then marked as shown
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('splashShown', 'true');
        }
        setShowSplash(false);
      }, 2500); // Match splash screen duration
      return () => clearTimeout(timer);
    }
  }, []);


  useEffect(() => {
     if (typeof window !== 'undefined') {
        const adminAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
        const agentAuth = sessionStorage.getItem('agentAuthenticated') === 'true';
        setIsAuthenticated({ admin: adminAuth, agent: agentAuth });
     }
  }, []);

  const handlePortalClick = (e: React.MouseEvent, portal: 'admin' | 'agent') => {
    e.preventDefault();
    if (isAuthenticated[portal]) {
      router.push(portal === 'admin' ? '/dashboard' : '/leads');
    } else {
      setSelectedPortal(portal);
      setEmail(portal === 'admin' ? 'admin@proploom.com' : 'agent@proploom.com');
      setPassword('');
      setShowPassword(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userDoc = {
          displayName: user?.displayName || (selectedPortal === 'admin' ? 'Admin User' : 'Agent Smith'),
          isFirstLogin: false, // In a real app, this would be fetched from Firestore
      };

      if (userDoc.isFirstLogin) {
          router.push('/auth/set-password');
          return;
      }

      sessionStorage.setItem(`${selectedPortal}Authenticated`, 'true');
      sessionStorage.setItem('displayName', userDoc.displayName);
      sessionStorage.setItem('userRole', selectedPortal!);
      sessionStorage.setItem('userId', user.uid);
      
      setIsAuthenticated(prev => ({ ...prev, [selectedPortal!]: true }));

      toast({
          title: 'Login Successful',
          description: `Welcome to the ${selectedPortal} portal.`,
      });
      router.push(selectedPortal === 'admin' ? '/dashboard' : '/leads');

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Incorrect email or password. Please try again.',
        });
    } finally {
        setIsLoading(false);
        setPassword('');
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsLoading(true);

    const actionCodeSettings = {
        url: `${window.location.origin}`,
        handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, resetEmail, actionCodeSettings);
      toast({
        title: 'Reset Link Sent',
        description: 'Please check your email to reset your password.',
      });
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
         toast({
            variant: 'destructive',
            title: 'Error',
            description: 'This email is not registered.',
        });
      } else {
         toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to send reset email. Please try again later.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleLogout = (e: React.MouseEvent, portal: 'admin' | 'agent') => {
    e.stopPropagation();
    sessionStorage.removeItem(`${portal}Authenticated`);
    sessionStorage.removeItem('displayName');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userId');
    setIsAuthenticated(prev => ({ ...prev, [portal]: false }));
    toast({
      title: 'Logged Out',
      description: `You have been logged out from the ${portal} portal.`,
    });
  };

  const closeModal = () => {
    setSelectedPortal(null);
    setShowForgotPassword(false);
    setPassword('');
    setEmail('');
    setResetEmail('');
    setShowPassword(false);
  };

  const openForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedPortal(null);
    setShowForgotPassword(true);
  }

  const handleSplashFinish = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0px 0px 30px rgba(250, 204, 21, 0.4)', },
    tap: { scale: 0.95 },
  };

  const modalBackdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalContentVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
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
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={(e) => handlePortalClick(e, 'admin')} className="p-1 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary/50 cursor-pointer">
            <div className="bg-[#1a1a1a] rounded-xl p-8 h-full flex flex-col items-center justify-center">
              <ShieldCheck className="h-16 w-16 text-primary mb-4" />
              <h2 className="text-3xl font-bold">Admin Portal</h2>
              <p className="text-muted-foreground mt-2">Full access to analytics and settings.</p>
              {isAuthenticated.admin && <Button size="sm" variant="destructive" className="mt-4" onClick={(e) => handleLogout(e, 'admin')}>Logout</Button>}
            </div>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={(e) => handlePortalClick(e, 'agent')} className="p-1 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary/50 cursor-pointer">
            <div className="bg-[#1a1a1a] rounded-xl p-8 h-full flex flex-col items-center justify-center">
              <UserCheck className="h-16 w-16 text-primary mb-4" />
              <h2 className="text-3xl font-bold">Agent Portal</h2>
              <p className="text-muted-foreground mt-2">Manage and track your assigned leads.</p>
              {isAuthenticated.agent && <Button size="sm" variant="destructive" className="mt-4" onClick={(e) => handleLogout(e, 'agent')}>Logout</Button>}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedPortal && (
          <motion.div variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden" className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <motion.div variants={modalContentVariants} className="w-full max-w-sm p-8 bg-[#1a1a1a] border border-primary/20 rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-center mb-2 capitalize">{selectedPortal} Portal Login</h2>
              <p className="text-muted-foreground text-center mb-8">Enter your credentials to continue.</p>
              
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 h-12" />
                <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 pr-10 h-12" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <div className="text-right">
                  <a href="#" onClick={openForgotPassword} className="text-xs text-primary/80 hover:text-primary hover:underline">Forgot Password?</a>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-base h-12">
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Continue'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showForgotPassword && (
          <motion.div variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden" className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
            <motion.div variants={modalContentVariants} className="w-full max-w-sm p-8 bg-[#1a1a1a] border border-primary/20 rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
              <p className="text-muted-foreground text-center mb-8">Enter your email to receive a reset link.</p>
              
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <Input type="email" placeholder="Enter your registered email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required autoFocus className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 h-12" />
                <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-base h-12">
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;

    