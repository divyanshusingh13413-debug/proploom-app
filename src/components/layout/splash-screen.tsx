'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function SplashScreen() {
  const [isHidden, setIsHidden] = useState(false);
  const houseImage = PlaceHolderImages.find(img => img.id === 'splash-house');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHidden(true);
    }, 2800); // Start transition slightly before timeout in client-layout

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`splash-screen ${isHidden ? 'hidden' : ''}`}>
        <div className="curtain-container">
            <div className="curtain curtain-left"></div>
            <div className="curtain curtain-right"></div>
        </div>
        <div className="splash-content">
            <div className="logo-container">
                <h1 className="logo-text">PROPLOOM</h1>
            </div>
            <p className="tagline">Defining Luxury Living</p>
            {houseImage && (
              <div className="house-animation-container">
                <Image
                  src={houseImage.imageUrl}
                  alt={houseImage.description}
                  width={300}
                  height={200}
                  className="object-contain rounded-lg shadow-2xl shadow-yellow-500/20"
                  data-ai-hint={houseImage.imageHint}
                  priority
                />
              </div>
            )}
        </div>
    </div>
  );
}
