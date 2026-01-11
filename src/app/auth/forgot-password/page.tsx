
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [resetEmail, setResetEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetEmail) return;
        setIsLoading(true);
    
        const actionCodeSettings = {
            url: `${window.location.origin}/auth/login`, // Redirect to login after reset
            handleCodeInApp: true,
        };
    
        try {
          await sendPasswordResetEmail(auth, resetEmail, actionCodeSettings);
          toast({
            title: 'Reset Link Sent',
            description: 'Please check your email to reset your password.',
          });
          router.push('/auth/login');
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
             <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Portal Selection
             </Link>
            <motion.div variants={modalBackdropVariants} initial="hidden" animate="visible" className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div variants={modalContentVariants} className="w-full max-w-sm p-8 bg-[#1a1a1a] border border-primary/20 rounded-2xl shadow-2xl">
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
        </div>
    );
}
