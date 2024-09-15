'use client';

import React, { useRef, useState } from 'react';

import { searchImages } from '@/app/actions/search-images-action';
import { searchImagesByImage } from '@/app/actions/search-images-by-image-action';
import { uploadImage } from '@/app/actions/upload-images-action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SimilaritySearchResults } from '@/types/search';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Search, Upload, X } from 'lucide-react';
import Image from 'next/image';

import { PhotoCard } from './photo-card';

export default function ImageSearchGallery() {
  const [query, setQuery] = useState('');
  const [imageQuery, setImageQuery] = useState('');
  const [aiQuery, setAiQuery] =
    useState<SimilaritySearchResults['refinedQuery']>();
  const [results, setResults] = useState<
    SimilaritySearchResults['formattedResults']
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchImages(searchQuery, 5);
      setResults(data.results);
      setAiQuery(data.refinedQuery);
      setQuery(searchQuery);
      setImageQuery(''); // Clear image query when performing text search
    } catch (error) {
      console.error('Search error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred during the search'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSearch = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const imageUrl = await uploadImage(formData);
      setImageQuery(imageUrl);
      const data = await searchImagesByImage(imageUrl);
      setResults(data.results);
      setAiQuery(undefined);
      setQuery('');
    } catch (error) {
      console.error('Image search error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred during the image search'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleTagClick = (tag: string) => {
    handleSearch(tag);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSearch(file);
    }
  };

  const clearImageQuery = () => {
    setImageQuery('');
  };

  return (
    <div className='container mx-auto px-4 py-8 min-h-screen'>
      <motion.h1
        className='text-4xl font-bold mb-8 text-center text-primary'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Image Search Gallery
      </motion.h1>

      <motion.div
        className='mb-8 space-y-4'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className='flex gap-2'>
          <Input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Enter your search query'
            className='flex-grow border-2 border-primary/20 focus:border-primary rounded-full px-6'
          />
          <Button
            type='submit'
            disabled={isLoading}
            className='rounded-full bg-primary hover:bg-primary/90 text-primary-foreground'
          >
            <Search
              className={cn('mr-2 h-4 w-4', isLoading ? 'animate-spin' : '')}
            />
            Search
          </Button>
          <Button
            type='button'
            onClick={handleImageUpload}
            disabled={isLoading}
            className='rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground'
          >
            <Camera className='mr-2 h-4 w-4' />
            Image Search
          </Button>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            accept='image/*'
            className='hidden'
          />
        </form>

        <AnimatePresence>
          {imageQuery && (
            <motion.div
              className='bg-card p-6 rounded-xl shadow-lg border border-primary/20'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className='text-lg font-semibold mb-2 flex items-center justify-center text-primary'>
                <Upload className='mr-2 h-5 w-5 text-primary' />
                Uploaded Image Query
              </h2>
              <div className='relative w-full h-48 mb-4'>
                <Image
                  src={imageQuery}
                  alt='Uploaded image query'
                  layout='fill'
                  objectFit='contain'
                  className='rounded-md'
                />
                <Button
                  className='absolute top-2 right-2 p-1 h-8 w-8 rounded-full bg-destructive/80 hover:bg-destructive'
                  onClick={clearImageQuery}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {aiQuery && (
            <motion.div
              className='bg-card p-6 rounded-xl shadow-lg border border-primary/20'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className='text-lg font-semibold mb-2 flex items-center justify-center text-primary'>
                <Upload className='mr-2 h-5 w-5 text-primary' />
                AI Refined Query
              </h2>
              <p className='text-md mb-3 font-medium text-center text-primary'>
                {aiQuery.newQuery}
              </p>
              {aiQuery.tags && aiQuery.tags.length > 0 && (
                <motion.div className='flex flex-wrap gap-2 justify-center'>
                  {aiQuery.tags.map((tag, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                    >
                      <Badge
                        variant='secondary'
                        className='bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer'
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag.trim()}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {error && (
        <motion.p
          className='text-center text-destructive mb-4 bg-destructive/10 p-3 rounded-lg'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}

      <AnimatePresence>
        {results.length > 0 ? (
          <motion.div
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <PhotoCard result={result} onTagClick={handleTagClick} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            className='text-center text-primary bg-primary/10 p-4 rounded-lg shadow'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            No results to display. Try searching for something!
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        className='mt-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p className='text-sm text-muted-foreground max-w-2xl mx-auto border rounded-md p-4 text-center'>
          <strong>Disclaimer:</strong>
          <br />
          All images on{' '}
          <a href='https://rag.photomuse.ai'>https://rag.photomuse.ai</a> are
          the exclusive property of <strong>Meg Wise Photography</strong> and
          are protected by international copyright laws. Unauthorized use,
          reproduction, distribution, or modification of these images without
          prior written consent is strictly prohibited.
          <br />
          <br />
          <strong>Permission Notice for Microsoft Corporation:</strong>
          <br />
          Permission is granted to Microsoft Corporation and its affiliates to
          use screenshots or recordings of this application, which may include
          the protected images, solely for the purposes of promoting the
          Microsoft Hackathon, showcasing submissions, or related marketing
          activities.
          <br />© {new Date().getFullYear()}{' '}
          <a href='https://www.MegWise.com'>www.MegWise.com</a>. All rights
          reserved.
        </p>
      </motion.div>
    </div>
  );
}
