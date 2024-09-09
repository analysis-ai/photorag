'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChevronDown, Search } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

interface SearchResult {
  id: number;
  filePath: string;
  description: string;
  tags: string;
  distance: number;
  confidence: number;
}

export default function ImageSearchGallery() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/image-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, limit: 3 })
      });
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
      // Handle error (e.g., show error message to user)
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
          {isLoading ? 'Searching...' : <Search className='mr-2 h-4 w-4' />}
          Search
        </Button>
      </form>

      {results.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {results.map((result) => (
            <Card key={result.id} className='overflow-hidden'>
              <CardContent className='p-0'>
                <div className='relative w-full h-48'>
                  <Image
                    src={result.filePath}
                    alt={result.description}
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
                  {result.tags.split(',').map((tag, index) => (
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
                    <p>Distance: {result.distance.toFixed(4)}</p>
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
