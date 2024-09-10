import {
  arrayContained,
  arrayContains,
  arrayOverlaps,
  cosineDistance,
  getTableColumns
} from 'drizzle-orm';

import { db } from '@/db';
import { images } from '@/db/schema';
import { refineImageQuery } from '@/lib/azure-generate';
import { vectorizeText } from '@/lib/azure-computer-vision';

function calculateConfidence(distance: number) {
  const minDistance = 0; // Assuming this is the ideal (closest match)
  const maxDistance = 2; // Adjust based on data distribution

  return 1 - (distance - minDistance) / (maxDistance - minDistance);
}

export async function similaritySearch(query: string, limit: number = 5) {
  try {
    const refinedQuery = await refineImageQuery(query);

    console.log('Refined query:', JSON.stringify(refinedQuery.object, null, 2));

    const queryEmbedding = await vectorizeText(refinedQuery.object.newQuery);

    // TODO - do separate search with tags and without and compare results in the UI

    const results = await db
      .select({
        ...getTableColumns(images),
        distance: cosineDistance(images.imageVector, queryEmbedding.vector)
      })
      .from(images)
      .where(arrayOverlaps(images.tags, refinedQuery.object.tags))
      .orderBy((fields) => [fields.distance])
      .limit(limit);

    // Normalizing confidence based on cosine distance range (0 to 2)
    const formattedResults = results.map((result) => ({
      ...result,
      confidence: calculateConfidence(Number(result.distance)),
      distance: result.distance
    }));

    return formattedResults;
  } catch (error) {
    console.error('Error in similarity search:', error);
    throw error;
  }
}
