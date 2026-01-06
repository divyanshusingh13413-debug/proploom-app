
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebase';
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
      
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      
      toast({
        title: 'Account Created',
        description: 'Welcome to PROPLOOM! Redirecting you to the dashboard.',
      });
      router.push('/');

    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already associated with an account.');
      } else {
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
    <div className="relative min-h-screen w-full bg-gradient-to-br from-background to-[#101c32] flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div 
          variants={shakeAnimation}
          animate={animation}
          className="bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl shadow-black/50"
        >
          <div className="p-8 md:p-12">
            <div className="flex justify-center mb-6">
                 <div className="flex items-center gap-2.5 font-bold text-2xl text-white tracking-tighter">
                    <Building2 className="text-accent" />
                    <span className="font-headline">PROPLOOM</span>
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
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:ring-accent focus:border-accent transition-all duration-300"
                />
              </motion.div>
              <motion.div variants={inputVariants} initial="hidden" animate="visible" custom={2} className="relative">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:ring-accent focus:border-accent transition-all duration-300"
                />
              </motion.div>

              <motion.div variants={inputVariants} initial="hidden" animate="visible" custom={3} className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:ring-accent focus:border-accent transition-all duration-300 pr-10"
                />
                 <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
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
                    className="text-center text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-md py-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} variants={inputVariants} initial="hidden" animate="visible" custom={4}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent text-black font-bold text-base h-12 hover:bg-yellow-400 transition-all duration-300 shadow-[0_0_20px_hsl(var(--accent)/20%)]"
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </motion.div>

              <div className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-accent hover:underline">
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
