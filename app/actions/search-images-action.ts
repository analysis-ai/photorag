'use server';

import { generateSasUrl } from '@/lib/azure-blob';
import { similaritySearch } from '@/lib/similarity-search';
import { SimilaritySearchResults } from '@/types/search';

export async function searchImages(
  query: string,
  limit?: number
): Promise<{
  message: string;
  results: SimilaritySearchResults['formattedResults'];
  refinedQuery: SimilaritySearchResults['refinedQuery'];
}> {
  try {
    if (typeof query !== 'string' || query.trim() === '') {
      throw new Error('Invalid query');
    }

    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
      throw new Error('Invalid limit');
    }

    const { formattedResults, refinedQuery } = await similaritySearch(
      query,
      limit
    );

    return {
      message: `Found ${formattedResults.length} results`,
      results: formattedResults.map((result) => {
        const blobName = result.filePath.split('/').pop() || '';
        const sasUrl = generateSasUrl(blobName);
        return {
          ...result,
          filePath: sasUrl // Use the SAS URL instead of the original filePath
        };
      }),
      refinedQuery
    };
  } catch (error) {
    console.error('Error in image search:', error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}
