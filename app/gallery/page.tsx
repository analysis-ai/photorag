import React from 'react';

import { GalleryAnimation } from '@/components/gallery-animation';
import { ImageWithUrl } from '@/types/image';

import { action } from './actions/get-images-action';

export const revalidate = 3600; // Revalidate every hour

export default async function ImageGallery() {
  const images: ImageWithUrl[] = await action();

  return (
    <div className='container mx-auto px-4 py-8'>
      <GalleryAnimation images={images} />
    </div>
  );
}
