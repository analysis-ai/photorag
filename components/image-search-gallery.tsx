'use client';

import React, { useState } from 'react';

import { searchImages } from '@/app/actions/search-images-action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SimilaritySearchResults } from '@/types/search';
import { ChevronDown, Search } from 'lucide-react';
import Image from 'next/image';

export default function ImageSearchGallery() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SimilaritySearchResults>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchImages(query, 5);
      setResults(data.results);
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

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8 text-center'>
        Image Search Gallery
      </h1>

      <form onSubmit={handleSearch} className='mb-8 flex gap-2'>
        <Input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Enter your search query'
          className='flex-grow'
        />
        <Button type='submit' disabled={isLoading}>
          <Search
            className={cn('mr-2 h-4 w-4', isLoading ? 'animate-pulse' : '')}
          />
          Search
        </Button>
      </form>

      {error && <p className='text-center text-red-500 mb-4'>{error}</p>}

      {results.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {results.map((result) => (
            <Card key={result.id} className='overflow-hidden'>
              <CardContent className='p-0'>
                <div className='relative w-full h-48'>
                  <Image
                    src={result.filePath}
                    alt={result.caption || 'Image'}
                    layout='fill'
                    objectFit='cover'
                  />
                </div>
              </CardContent>
              <CardFooter className='flex flex-col items-start p-4'>
                <p className='text-sm mb-2 line-clamp-2'>
                  {result.description}
                </p>
                <div className='flex flex-wrap gap-1 mb-2'>
                  {result.tags?.map((tag, index) => (
                    <Badge key={index} variant='secondary'>
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
                <Collapsible className='w-full'>
                  <CollapsibleTrigger className='flex items-center justify-between w-full text-sm text-muted-foreground hover:underline'>
                    <span>Show details</span>
                    <ChevronDown className='h-4 w-4' />
                  </CollapsibleTrigger>
                  <CollapsibleContent className='mt-2 space-y-1 text-sm'>
                    <p>ID: {result.id}</p>
                    <p>Distance: {Number(result.distance)}</p>
                    <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
                    <p className='text-sm mb-2'>{result.description}</p>
                  </CollapsibleContent>
                </Collapsible>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className='text-center text-muted-foreground'>
          No results to display. Try searching for something!
        </p>
      )}
    </div>
  );
}
