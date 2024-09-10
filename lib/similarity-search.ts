import { db } from '@/db';
import { images } from '@/db/schema';
import { vectorizeText } from '@/lib/azure-computer-vision';
import { cosineDistance, getTableColumns } from 'drizzle-orm';

function calculateConfidence(distance: number) {
  const minDistance = 0; // Assuming this is the ideal (closest match)
  const maxDistance = 2; // Adjust based on data distribution

  return 1 - (distance - minDistance) / (maxDistance - minDistance);
}

export async function similaritySearch(query: string, limit: number = 5) {
  try {
    const queryEmbedding = await vectorizeText(query);

    const results = await db
      .select({
        ...getTableColumns(images),
        distance: cosineDistance(images.imageVector, queryEmbedding.vector)
      })
      .from(images)
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
