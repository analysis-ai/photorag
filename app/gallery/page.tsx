'use client';

import React from 'react';

import { GalleryAnimation } from '@/components/gallery-animation';
import { Button } from '@/components/ui/button';
import { ImageWithUrl } from '@/types/image';

import { action } from './actions/get-images-action';

export default function ImageGallery() {
  const [finalImages, setFinalImages] = React.useState<ImageWithUrl[]>([]);

  const handleLoadImages = async () => {
    const images = await action();
    setFinalImages(images);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-center mb-4'>
        <Button onClick={handleLoadImages}>Load Gallery</Button>
      </div>

      <GalleryAnimation images={finalImages} />
    </div>
  );
}
