'use client';

import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { ImageWithUrl } from '@/types/image';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function GalleryAnimation({ images }: { images: ImageWithUrl[] }) {
  return (
    <>
      <motion.h1
        className='text-4xl font-bold mb-8 text-center text-primary'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Image Gallery
      </motion.h1>
      <motion.p
        className='text-center text-muted-foreground mb-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Explore our collection of {images.length} images available for search.
      </motion.p>
      <motion.div
        className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className='overflow-hidden'>
              <CardContent className='p-2'>
                <div className='relative aspect-square'>
                  <Image
                    src={image.sasUrl}
                    alt={image.caption || `Image ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className='rounded-md'
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
