
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Loader2 } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

const AnimatedParticles = () => {
  const particles = Array.from({ length: 50 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-yellow-500/50"
          initial={{
            x: Math.random() * 100 + 'vw',
            y: Math.random() * 100 + 'vh',
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.5,
          }}
          animate={{
            y: '-10vh',
            x: '+=5vw',
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'mirror',
            duration: Math.random() * 20 + 20,
            ease: 'linear',
          }}
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
          }}
        />
      ))}
    </div>
  );
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 overflow-hidden">
      <AnimatedParticles />
      <motion.div
        className="relative z-10 w-full max-w-md p-8 space-y-6 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2.5 font-bold text-2xl text-white tracking-tighter mb-2">
            <Building2 className="text-yellow-400" />
            <span className="font-headline">PROPLOOM</span>
          </div>
          <p className="text-zinc-400">Welcome back to the future of real estate</p>
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div variants={itemVariants} transition={{ delay: 0.3 }}>
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-yellow-400"
            />
          </motion.div>
          <motion.div variants={itemVariants} transition={{ delay: 0.4 }}>
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-yellow-400"
            />
          </motion.div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <motion.div variants={itemVariants} transition={{ delay: 0.5 }}>
            <Button
              type="submit"
              className="w-full bg-yellow-500 text-slate-900 font-bold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:shadow-[0_0_30px_rgba(234,179,8,0.7)]"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
            </Button>
          </motion.div>
        </form>

        <motion.div className="relative" variants={itemVariants} transition={{ delay: 0.6 }}>
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black/30 px-2 text-zinc-400">
              Or continue with
            </span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} transition={{ delay: 0.7 }}>
          <Button
            variant="outline"
            className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <FaGoogle className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </motion.div>

        <motion.p className="text-center text-sm text-zinc-400" variants={itemVariants} transition={{ delay: 0.8 }}>
          Don't have an account?{' '}
          <Link href="/auth/signup" className="font-semibold text-yellow-400 hover:text-yellow-300">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
