
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';

export default function SetPasswordPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSetPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast({ variant: 'destructive', title: 'Passwords do not match.' });
            return;
        }
        if (newPassword.length < 6) {
            toast({ variant: 'destructive', title: 'Password is too short.', description: 'Password must be at least 6 characters.' });
            return;
        }

        setIsLoading(true);

        const user = auth.currentUser;
        if (!user) {
            toast({ variant: 'destructive', title: 'Not authenticated.', description: 'Please log in again.' });
            router.replace('/auth/login');
            return;
        }

        try {
            // Step 1: Update Firebase Auth password
            await updatePassword(user, newPassword);

            // Step 2: Update isFirstLogin flag in Firestore
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { isFirstLogin: false });

            toast({ title: 'Password Updated Successfully', description: 'You will now be redirected.' });

            // Step 3: Redirect to the appropriate dashboard
            const userDocSnap = await getDoc(userDocRef);
            const role = userDocSnap.exists() ? userDocSnap.data()?.role : 'agent'; // Default to agent if role not found

            router.replace(role === 'admin' ? '/dashboard' : '/leads');

        } catch (error: any) {
            console.error("Error setting new password:", error);
            toast({
                variant: 'destructive',
                title: 'Password update failed',
                description: error.message || 'An unexpected error occurred.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const modalContentVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-[#0F1115] text-white p-4">
            <motion.div 
                initial="hidden" 
                animate="visible"
                variants={modalContentVariants} 
                className="w-full max-w-md p-8 bg-[#1a1a1a] border border-primary/20 rounded-2xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <KeyRound className="mx-auto h-12 w-12 text-primary mb-4" />
                    <h2 className="text-2xl font-bold">Set Your New Password</h2>
                    <p className="text-muted-foreground">For security, please create a new password for your account.</p>
                </div>
                
                <form onSubmit={handleSetPasswordSubmit} className="space-y-6">
                    <div className="relative">
                        <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="New Password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required 
                            className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary h-12"
                        />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                     <div className="relative">
                        <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Confirm New Password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                            className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary h-12"
                        />
                    </div>
                    
                    <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-base h-12">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Set Password & Continue'}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
