
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, UserCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        if (userData.isFirstLogin) {
          router.push('/auth/set-password');
        } else {
          if (userData.role === 'admin') {
            router.push('/dashboard');
          } else if (userData.role === 'agent') {
            router.push('/leads');
          } else {
            throw new Error('Unknown user role.');
          }
        }
      } else {
        throw new Error('User data not found in Firestore.');
      }

    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = 'Incorrect email or password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          default:
            errorMessage = 'Login failed. Please check your credentials.';
            break;
        }
      }
       toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
    } finally {
        setIsLoading(false);
    }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
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
            <Link href="/" className="flex items-center gap-4 font-bold text-3xl tracking-tighter">
              <Building2 className="text-primary h-8 w-8" />
              <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PROPLOOM
              </span>
            </Link>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Portal Access</h2>
        <p className="text-muted-foreground text-center mb-8">Enter your credentials to continue.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 h-12"
                />
            </div>

            <div className="relative space-y-2">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-base h-12">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Continue'}
            </Button>
        </form>

        <div className="text-center mt-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Back to role selection
            </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
