'use client';

import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SimilaritySearchResults } from '@/types/search';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Info } from 'lucide-react';
import Image from 'next/image';

interface PhotoCardProps {
  result: SimilaritySearchResults['formattedResults'][0];
  onTagClick: (tag: string) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ result, onTagClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation(); // Prevent the card from toggling open/closed
    onTagClick(tag);
  };

  return (
    <Card className='overflow-hidden'>
      <motion.div
        layout
        className='relative cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div layout className='relative aspect-square'>
          <Image
            src={result.filePath}
            alt={result.caption || 'Image'}
            layout='fill'
            objectFit='cover'
            className='rounded-t-lg'
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-semibold'>
                  {(result.confidence * 100).toFixed(0)}%
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {(result.confidence * 100).toFixed(0)}% confidence in the
                  search result
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
        <div className='absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 truncate'>
          {result.caption}
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              className='absolute top-0 left-0 w-full h-full bg-card shadow-lg rounded-lg'
            >
              <div className='p-4 h-full overflow-y-auto'>
                <h3 className='font-semibold mb-2'>{result.caption}</h3>

                <div className='text-sm text-muted-foreground'>
                  <p>Distance: {Number(result.distance).toFixed(4)}</p>
                  <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>

                  <div className='flex items-start gap-1 mt-2'>
                    <Info className='h-4 w-4 mt-0.5 flex-shrink-0' />
                    <p className='text-xs pt-1'>
                      {result.confidenceExplanation}
                    </p>
                  </div>
                </div>
                <p className='text-sm mb-2'>{result.description}</p>
                <div className='flex flex-wrap gap-1 mb-2'>
                  {result.tags?.map((tag, index) => (
                    <Badge
                      key={index}
                      variant='secondary'
                      className='bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer'
                      onClick={(e) => handleTagClick(e, tag)}
                    >
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          layout
          className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 rounded-full p-1'
        >
          <ChevronRight
            className={cn(
              'h-6 w-6 text-white transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </motion.div>
      </motion.div>
    </Card>
  );
};
