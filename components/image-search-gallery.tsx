'use client';

import React, { useState } from 'react';

import { searchImages } from '@/app/actions/search-images-action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SimilaritySearchResults } from '@/types/search';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

import { PhotoCard } from './photo-card';

export default function ImageSearchGallery() {
  const [query, setQuery] = useState('');
  const [aiQuery, setAiQuery] =
    useState<SimilaritySearchResults['refinedQuery']>();
  const [results, setResults] = useState<
    SimilaritySearchResults['formattedResults']
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchImages(searchQuery, 5);
      setResults(data.results);
      setAiQuery(data.refinedQuery);
      setQuery(searchQuery); // Update the input field with the searched query
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleTagClick = (tag: string) => {
    handleSearch(tag);
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
        </form>

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
                <Sparkles className='mr-2 h-5 w-5 text-primary' />
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
    </div>
  );
}
