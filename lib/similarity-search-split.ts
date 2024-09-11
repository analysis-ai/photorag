import { db } from '@/db';
import { images } from '@/db/schema';
import { vectorizeText } from '@/lib/azure-computer-vision';
import { refineImageQuery } from '@/lib/azure-generate';
import {
  arrayContained,
  arrayContains,
  arrayOverlaps,
  cosineDistance,
  getTableColumns
} from 'drizzle-orm';

function calculateConfidence(distance: number) {
  const minDistance = 0; // Assuming this is the ideal (closest match)
  const maxDistance = 2; // Adjust based on data distribution

  return 1 - (distance - minDistance) / (maxDistance - minDistance);
}

function calculateTagOverlapConfidence(
  resultTags: string[],
  queryTags: string[]
) {
  const overlappingTags = resultTags.filter((tag) => queryTags.includes(tag));
  return overlappingTags.length / queryTags.length; // Simple ratio-based overlap confidence
}

export async function similaritySearch(query: string, limit: number = 5) {
  try {
    const refinedQuery = await refineImageQuery(query);

    const queryEmbedding = await vectorizeText(refinedQuery.object.newQuery);

    // Perform the initial vector search
    const results = await db
      .select({
        ...getTableColumns(images),
        distance: cosineDistance(
          images.descriptionVector,
          queryEmbedding.vector
        )
      })
      .from(images)
      .orderBy((fields) => [fields.distance])
      .limit(limit);

    // Process and calculate confidence with tags
    const formattedResults = results.map((result) => {
      const vectorConfidence = calculateConfidence(Number(result.distance));
      const tagConfidence = result?.tags
        ? calculateTagOverlapConfidence(result.tags, refinedQuery.object.tags)
        : 0;

      // Adjust the final confidence score by combining the vector confidence and tag confidence
      const confidenceWithTags = vectorConfidence * 0.8 + tagConfidence * 0.2; // Adjust weightings as needed

      return {
        ...result,
        vectorConfidence,
        tagConfidence,
        confidenceWithTags,
        distance: result.distance
      };
    });

    return { formattedResults, refinedQuery: refinedQuery.object };
  } catch (error) {
    console.error('Error in similarity search:', error);
    throw error;
  }
}
