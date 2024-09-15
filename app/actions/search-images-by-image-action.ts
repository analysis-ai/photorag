'use server';

import { generateSasUrl } from '@/lib/azure-blob';
import { similaritySearch } from '@/lib/similarity-search';
import { SimilaritySearchResults } from '@/types/search';

export async function searchImagesByImage(imageUrl: string): Promise<{
  message: string;
  results: SimilaritySearchResults['formattedResults'];
}> {
  try {
    if (typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      throw new Error('Invalid image data');
    }

    const { formattedResults } = await similaritySearch(imageUrl, 5, true);

    return {
      message: `Found ${formattedResults.length} results`,
      results: formattedResults.map((result) => {
        const blobName = result.filePath.split('/').pop() || '';
        const sasUrl = generateSasUrl(blobName);
        return {
          ...result,
          filePath: sasUrl // Use the SAS URL instead of the original filePath
        };
      })
    };
  } catch (error) {
    console.error('Error in image search:', error);
    throw new Error(
      error instanceof Error ? error.message : JSON.stringify(error, null, 2)
    );
  }
}
