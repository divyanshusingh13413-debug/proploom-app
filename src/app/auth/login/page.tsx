
'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const intendedRole = searchParams.get('role') || 'admin';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Firebase Authentication (Email/Pass check)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Auth Success for:', user.uid);

      // 2. Database check (Agar error aaye toh skip kar do)
      let userRole = intendedRole || 'admin';
      let displayName = 'User';
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        userRole = userData.role;
        displayName = userData.displayName;

         // Check if it's the user's first login
        if (userData.isFirstLogin) {
            toast({ title: 'Welcome!', description: 'Please set your new password to continue.' });
            router.push('/auth/set-password');
            return; // Stop execution to redirect
        }
      } else {
        // This case should ideally not happen if user creation is handled correctly.
        // But as a fallback, we can deny login.
        throw new Error('User data not found in database.');
      }

      // 3. Session set karein
      sessionStorage.setItem('userRole', userRole);
      sessionStorage.setItem('userId', user.uid);
      sessionStorage.setItem('displayName', displayName);
      
      toast({ title: 'Login Successful', description: `Redirecting as ${userRole}...` });

      // 4. Sabse important: Redirect logic
      // Agar role agent hai toh /leads, agar admin hai toh /dashboard
      const redirectPath = userRole === 'admin' ? '/dashboard' : '/leads';
      router.push(redirectPath);

    } catch (error: any) {
      console.error("Login Error:", error.message);
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        description = "Invalid credentials. Please check your email and password.";
      } else if (error.message.includes('User data not found')) {
        description = "Your user profile is not configured correctly. Please contact support.";
      }
      
      toast({ 
        variant: 'destructive', 
        title: 'Login Failed', 
        description: description
      });
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115] text-white p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" />
        Back to Portal Selection
      </Link>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
            className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 h-12"
             />
          
          <div className="relative">
            <Input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 h-12 pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="text-right">
              <Link href="/auth/forgot-password"
                 className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Forgot Password?
              </Link>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-base h-12">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Continue'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="flex items-center gap-2">
            <Loader2 className="animate-spin text-primary"/>
            <span className="font-mono">Loading Secure Portal...</span>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
