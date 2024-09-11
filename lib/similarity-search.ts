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

type ImageResult = {
  id: number;
  descriptionVector: number[] | null;
  tags: string[] | null;
  distance: unknown;
  confidence?: number;
  confidenceExplanation?: string;
};

type RefinedQuery = {
  newQuery: string;
  tags: string[];
};

function calculateConfidence(distance: number) {
  const minDistance = 0; // Assuming this is the ideal (closest match)
  const maxDistance = 2; // Adjust based on data distribution

  return 1 - (distance - minDistance) / (maxDistance - minDistance);
}

function generateConfidenceExplanation(
  result: ImageResult,
  refinedQuery: RefinedQuery,
  distance: number,
  tagMatchCount?: number
) {
  let explanation = `This image was matched based on a cosine similarity score of ${distance.toFixed(2)}. `;

  // Add tag explanation
  if (tagMatchCount && tagMatchCount > 0) {
    explanation += `There were ${tagMatchCount} matching tags: ${result.tags?.filter((tag) => refinedQuery.tags.includes(tag)).join(', ')}. `;
  } else {
    explanation += `No tags overlapped between the query and the image. `;
  }

  // Final confidence breakdown
  explanation += `The overall confidence score is a result of combining the vector similarity and tag overlap.`;

  return explanation;
}

export async function similaritySearch(query: string, limit: number = 5) {
  try {
    const refinedQuery = await refineImageQuery(query);
    const queryEmbedding = await vectorizeText(refinedQuery.object.newQuery);

    const results = await db
      .select({
        ...getTableColumns(images),
        distance: cosineDistance(
          images.descriptionVector,
          queryEmbedding.vector
        )
      })
      .from(images)
      .where(arrayOverlaps(images.tags, refinedQuery.object.tags))
      .orderBy((fields) => [fields.distance])
      .limit(limit);

    const formattedResults = results.map((result) => {
      const distance = Number(result.distance);
      const confidence = calculateConfidence(distance);

      // Count tag overlaps
      const tagMatchCount = result.tags?.filter((tag) =>
        refinedQuery.object.tags.includes(tag)
      ).length;

      // Generate explanation
      const confidenceExplanation = generateConfidenceExplanation(
        result,
        refinedQuery.object,
        distance,
        tagMatchCount
      );

      return {
        ...result,
        confidence,
        confidenceExplanation, // Add the explanation to the result
        distance
      };
    });

    return { formattedResults, refinedQuery: refinedQuery.object };
  } catch (error) {
    console.error('Error in similarity search:', error);
    throw error;
  }
}
