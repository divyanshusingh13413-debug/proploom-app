
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { useToast } from '@/components/ui/use-toast';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const SignupPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [animation, setAnimation] = useState<'initial' | 'shake'>('initial');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnimation('initial');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile in Firebase Auth
      await updateProfile(user, { displayName: name });

      // Create a document in the 'users' collection in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: name,
        email: user.email,
        isFirstLogin: true,
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: 'Account Created',
        description: 'Welcome to PROPLOOM! Redirecting you to the portal.',
      });
      router.push('/');

    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already associated with an account.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      }
      else {
        setError('An unexpected error occurred. Please try again.');
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
    initial: {
      x: 0
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
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
            
            <form onSubmit={handleSignup} className="space-y-6">
              <motion.div variants={inputVariants} initial="hidden" animate="visible" custom={1} className="relative">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300"
                />
              </motion.div>
              <motion.div variants={inputVariants} initial="hidden" animate="visible" custom={2} className="relative">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300"
                />
              </motion.div>

              <motion.div variants={inputVariants} initial="hidden" animate="visible" custom={3} className="relative">
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
              </motion.div>

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

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} variants={inputVariants} initial="hidden" animate="visible" custom={4}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-base h-12 hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_hsl(var(--primary)/20%)]"
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </motion.div>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-primary hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
            
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
