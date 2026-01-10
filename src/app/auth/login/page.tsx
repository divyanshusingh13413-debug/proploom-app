
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { useToast } from '@/components/ui/use-toast';
import { Building2, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [animation, setAnimation] = useState<'initial' | 'shake'>('initial');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnimation('initial');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check for admin role in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        toast({
          title: 'Admin Login Successful',
          description: `Welcome back, ${userDoc.data().displayName || 'Admin'}!`,
        });
        router.push('/dashboard');
      } else {
        setError('Unauthorized: Admin access only.');
        await signOut(auth);
        setAnimation('shake');
        setTimeout(() => setAnimation('initial'), 500);
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
        console.error(err);
      }
      setAnimation('shake');
      setTimeout(() => setAnimation('initial'), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const shakeAnimation = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    },
    initial: { x: 0 }
  };

  return (
    <div className="relative min-h-screen w-full bg-background flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div
          variants={shakeAnimation}
          animate={animation}
          className="bg-card/80 backdrop-blur-lg rounded-2xl border border-border/50 shadow-2xl"
        >
          <div className="p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2.5 font-bold text-2xl text-foreground tracking-tighter">
                <Building2 className="text-primary" />
                <span className="font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PROPLOOM</span>
              </div>
            </div>
            
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Admin Portal</h2>
                <p className="text-muted-foreground">Please sign in to continue.</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300"
                />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center justify-center gap-2 text-center text-sm font-medium text-destructive-foreground bg-destructive/20 border border-destructive/30 rounded-md py-2"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-base h-12 hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_hsl(var(--primary)/20%)]"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </motion.div>

              <div className="text-center text-sm text-muted-foreground">
                Not an admin?{' '}
                <Link href="/" className="font-medium text-primary hover:underline">
                  Go back
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
