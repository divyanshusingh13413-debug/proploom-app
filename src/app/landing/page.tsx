
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const MotionImage = motion(Image);

const FeatureCard = ({
  imageSrc,
  imageAlt,
  imageHint,
  title,
  description,
  align,
}: {
  imageSrc: string;
  imageAlt: string;
  imageHint: string;
  title: string;
  description: string;
  align: 'left' | 'right';
}) => {
  const cardVariants = {
    offscreen: {
      y: 100,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 1.2,
      },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.4 }}
      variants={cardVariants}
    >
      <div className={`p-2 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl shadow-yellow-500/10 ${align === 'right' ? 'lg:order-last' : ''}`}>
         <div className="p-2 bg-black rounded-lg">
            <MotionImage
                src={imageSrc}
                alt={imageAlt}
                width={1200}
                height={800}
                data-ai-hint={imageHint}
                className="rounded-md"
                initial={{ scale: 1.1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
         </div>
      </div>
      <div className="text-center lg:text-left">
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-4">
          {title}
        </h3>
        <p className="text-lg text-neutral-400 max-w-lg mx-auto lg:mx-0">
          {description}
        </p>
      </div>
    </motion.div>
  );
};


export default function LandingPage() {

  const adminDashboardImage = PlaceHolderImages.find(img => img.id === 'landing-dashboard');
  const agentLeadsImage = PlaceHolderImages.find(img => img.id === 'landing-leads-mobile');
  const aiPredictionImage = PlaceHolderImages.find(img => img.id === 'landing-ai-predictions');

  return (
    <div className="min-h-screen bg-black text-white font-body overflow-x-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 h-full w-full bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-20 p-8">
            <div className="container mx-auto flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Building2 className="text-yellow-500 h-8 w-8" />
                    <span className="font-bold text-2xl tracking-tighter">PROPLOOM</span>
                </div>
                <Button variant="outline" className="bg-transparent border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300">
                    Request Demo
                </Button>
            </div>
        </header>

        {/* Hero Section */}
        <main className="relative z-10">
            <section className="h-screen flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-8"
                >
                    <div className="flex text-yellow-400">
                        <Star className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-yellow-200">Trusted by Top Agencies in DIFC & Business Bay</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl md:text-7xl font-black max-w-4xl bg-gradient-to-br from-neutral-50 to-yellow-300 bg-clip-text text-transparent"
                >
                    Empower Your Dubai Real Estate Agency with AI
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-6 text-lg md:text-xl max-w-2xl text-neutral-400"
                >
                    Close 2x more deals in Downtown, Marina, and Palm Jumeirah using our intelligent lead-scoring engine.
                </motion.p>
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-10"
                >
                    <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform duration-300">
                        Get Started
                    </Button>
                </motion.div>
            </section>
            
            {/* Features Section */}
            <section className="py-24 px-4 container mx-auto space-y-24">
                {adminDashboardImage && (
                    <FeatureCard 
                        imageSrc={adminDashboardImage.imageUrl}
                        imageAlt="Admin Analytics Dashboard"
                        imageHint={adminDashboardImage.imageHint}
                        title="Comprehensive Admin Dashboard"
                        description="Monitor agent performance, track sales pipelines, and gain actionable insights with our powerful analytics dashboard. All your data, beautifully visualized in one place."
                        align="left"
                    />
                )}
                 {agentLeadsImage && (
                    <FeatureCard 
                        imageSrc={agentLeadsImage.imageUrl}
                        imageAlt="Agent Lead List on Mobile"
                        imageHint={agentLeadsImage.imageHint}
                        title="Mobile-First for Agents on the Go"
                        description="Your agents can manage leads, update statuses, and communicate with clients directly from their mobile devices. Never miss an opportunity, whether you're in the office or on-site."
                        align="right"
                    />
                )}
                 {aiPredictionImage && (
                    <FeatureCard 
                        imageSrc={aiPredictionImage.imageUrl}
                        imageAlt="AI Lead Scoring Screen"
                        imageHint={aiPredictionImage.imageHint}
                        title="Intelligent AI Lead Scoring"
                        description="Our AI engine analyzes lead behavior, preferences, and interactions to predict which leads are 'Hot' and ready to close. Focus your energy where it matters most."
                        align="left"
                    />
                )}
            </section>
        </main>
    </div>
  );
}

