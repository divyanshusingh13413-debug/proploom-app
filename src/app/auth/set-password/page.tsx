
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { motion } from 'framer-motion';
import { Building2, KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

const SetPasswordPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);


  useEffect(() => {
    // Ensure user is authenticated before allowing access
    const user = auth.currentUser;
    if (!user) {
      router.replace('/auth/login');
    } else {
        setIsPageLoading(false);
    }
  }, [router]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
        description: 'Please ensure both passwords are the same.',
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Password too weak',
        description: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setIsLoading(true);
    const user = auth.currentUser;

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'No user is currently signed in. Please log in again.',
      });
      router.push('/auth/login');
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Update Firebase Auth password
      await updatePassword(user, newPassword);

      // Step 2: Update Firestore isFirstLogin flag
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        isFirstLogin: false,
      });

      toast({
        title: 'Password Updated',
        description: 'Your password has been set successfully. Redirecting...',
      });
      
      // Redirect based on role
      const userDoc = await (await fetch(`/api/user?uid=${user.uid}`)).json();
      if (userDoc.role === 'admin') {
          router.push('/dashboard');
      } else {
          router.push('/leads');
      }

    } catch (error: any) {
      console.error("Password update failed:", error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not update your password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  };

  if (isPageLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115]">
            <Loader2 className="h-10 w-10 text-primary animate-spin"/>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115] text-white p-4">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md p-8 bg-[#1a1a1a] border border-primary/20 rounded-2xl shadow-2xl"
      >
        <div className="flex justify-center mb-6">
            <div className="flex items-center gap-4 font-bold text-3xl tracking-tighter">
              <KeyRound className="text-primary h-8 w-8" />
              <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Set Your Password
              </span>
            </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Secure Your Account</h2>
        <p className="text-muted-foreground text-center mb-8">This is a one-time setup. Please create a new password.</p>
        
        <form onSubmit={handleSetPassword} className="space-y-6">
            <div className="relative space-y-2">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 pr-10 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-0 right-0 flex items-center h-12 pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 h-12"
                />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-base h-12">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Set Password & Continue'}
            </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default SetPasswordPage;
