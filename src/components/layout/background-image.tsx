
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function BackgroundImage() {
  const houseImage = PlaceHolderImages.find(img => img.id === 'splash-house');

  return (
    <>
      {houseImage && (
          <Image
              src={houseImage.imageUrl}
              alt={houseImage.description}
              fill
              className="object-cover -z-10"
              data-ai-hint={houseImage.imageHint}
              priority
          />
      )}
      <div className="fixed inset-0 bg-black/50 -z-10"></div>
    </>
  );
}
