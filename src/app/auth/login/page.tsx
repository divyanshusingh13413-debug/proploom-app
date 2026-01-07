
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { useToast } from '@/components/ui/use-toast';
import { FcGoogle } from 'react-icons/fc';
import { Building2, Eye, EyeOff } from 'lucide-react';
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnimation('initial');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Login Successful',
        description: 'Welcome back to PROPLOOM!',
      });
      router.push('/');
    } catch (err: any) { 
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
            setError('Invalid email or password. Please try again.');
        } else {
            setError('An unexpected error occurred. Please try again.');
        }
        setAnimation('shake');
        setTimeout(() => setAnimation('initial'), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Login Successful',
        description: 'Welcome to PROPLOOM!',
      });
      router.push('/');
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      setAnimation('shake');
      setTimeout(() => setAnimation('initial'), 500);
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
    initial: {
      x: 0
    }
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
          className="bg-card/80 backdrop-blur-lg rounded-2xl border border-border shadow-2xl"
        >
          <div className="p-8 md:p-12">
            <div className="flex justify-center mb-6">
                 <div className="flex items-center gap-2.5 font-bold text-2xl text-foreground tracking-tighter">
                    <Building2 className="text-accent" />
                    <span className="font-headline">PROPLOOM</span>
                </div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-accent focus:border-accent transition-all duration-300"
                />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-accent focus:border-accent transition-all duration-300 pr-10"
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
                    className="text-center text-sm font-medium text-destructive-foreground bg-destructive/20 border border-destructive/30 rounded-md py-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent text-accent-foreground font-bold text-base h-12 hover:bg-accent/90 transition-all duration-300 shadow-[0_0_20px_hsl(var(--accent)/20%)]"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </motion.div>

              <div className="relative flex items-center justify-center my-6">
                  <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border"></span>
                  </div>
                  <div className="relative bg-background px-2 text-xs uppercase text-muted-foreground">Or continue with</div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-secondary-foreground transition-all duration-300"
                >
                    <FcGoogle className="mr-3 text-2xl" />
                    Sign In with Google
                </Button>
              </motion.div>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="font-medium text-accent hover:underline">
                  Sign up
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
