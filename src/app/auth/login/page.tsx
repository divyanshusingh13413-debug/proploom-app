
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const intendedRole = searchParams.get('role');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
        toast({ variant: 'destructive', title: 'Missing fields', description: 'Please enter both email and password.' });
        setIsLoading(false);
        return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verify user role from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().role === intendedRole) {
        const userData = userDoc.data();
        sessionStorage.setItem('userRole', userData.role);
        sessionStorage.setItem('displayName', userData.displayName);
        sessionStorage.setItem('userId', user.uid);
        
        toast({ title: 'Login Successful', description: `Welcome to the ${intendedRole} portal.` });
        
        if (userData.isFirstLogin) {
            router.push('/auth/set-password');
        } else {
            router.push(intendedRole === 'admin' ? '/dashboard' : '/leads');
        }
      } else {
        await auth.signOut(); // Sign out user if role doesn't match
        toast({ variant: 'destructive', title: 'Access Denied', description: 'You do not have access to this portal.' });
      }

    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Incorrect email or password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const modalBackdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalContentVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  };

  if (!intendedRole) {
      // Redirect if no role is specified
      router.replace('/');
      return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115] text-white p-4">
       <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Portal Selection
        </Link>
      <motion.div 
        variants={modalBackdropVariants} 
        initial="hidden" 
        animate="visible" 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div 
          variants={modalContentVariants} 
          className="w-full max-w-sm p-8 bg-[#1a1a1a] border border-primary/20 rounded-2xl shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-center mb-2 capitalize">{intendedRole} Portal Login</h2>
          <p className="text-muted-foreground text-center mb-8">Enter your credentials to continue.</p>
          
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              autoFocus 
              className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 h-12" />
            <div className="relative">
              <Input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 pr-10 h-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-xs text-primary/80 hover:text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-base h-12">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Continue'}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
