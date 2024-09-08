import { db } from '@/db';
import { images, imageVectors } from '@/db/schema';
import { generateEmbedding } from '@/lib/image-processing';
import { ImageSearchResult, ImageVectorQueryResult } from '@/types/search';
import { sql } from 'drizzle-orm';

export async function similaritySearch(query: string, limit: number = 5) {
  try {
    // TODO - run the query through AI to optimize the search
    const queryEmbedding = await generateEmbedding(query);

    // Convert the embedding array to a PostgreSQL-compatible vector string
    const vectorString = `'[${queryEmbedding.join(',')}]'`;

    const results = (await db.execute(sql`
      SELECT i.*, iv.description_vector, 
             iv.description_vector <=> ${sql.raw(vectorString)}::vector AS distance
      FROM ${imageVectors} iv
      JOIN ${images} i ON i.id = iv.image_id
      ORDER BY distance
      LIMIT ${sql.raw(limit.toString())}
    `)) as unknown as ImageVectorQueryResult[];

    const formattedResults: ImageSearchResult[] = results.map((result) => ({
      ...result,
      userId: result.user_id,
      filePath: result.file_path,
      tags: result.tags,
      confidence: 1 - result.distance, // Convert distance to confidence
      distance: result.distance
    }));

    return formattedResults;
  } catch (error) {
    console.error('Error in similarity search:', error);
    throw error;
  }
}
