import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding, processImage } from '@/lib/image-processing';
import { imageVectors, images } from '@/db/schema';

import { db } from '@/db'; // Assume you have this set up for Drizzle
import { headers } from 'next/headers';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const headersList = headers();
  const apiKey = headersList.get('x-api-key');

  if (apiKey !== process.env.PHOTOMUSE_API_KEY) {
    return NextResponse.json({ message: 'Invalid API key' }, { status: 401 });
  }

  try {
    const { imageUrl, userId } = await request.json();

    // Generate description and tags
    const { basicDescription, detailedDescription, tags } =
      await processImage(imageUrl);

    console.log(
      '%capp/api/upload-image/route.ts:26 basicDescription',
      'color: #007acc;',
      basicDescription
    );
    console.log(
      '%capp/api/upload-image/route.ts:27 detailedDescription',
      'color: #007acc;',
      detailedDescription
    );
    console.log(
      '%capp/api/upload-image/route.ts:28 tags',
      'color: #007acc;',
      tags
    );

    // Insert image into database
    const [imageRecord] = await db
      .insert(images)
      .values({
        filePath: imageUrl,
        description: detailedDescription,
        tags: tags.join(','),
        userId
      })
      .onConflictDoUpdate({
        target: images.filePath,
        set: {
          description: sql`excluded.description`,
          tags: sql`excluded.tags`
        }
      })
      .returning();

    // Generate embedding for description
    const descriptionEmbedding = await generateEmbedding(detailedDescription);

    // Insert embedding into database
    await db
      .insert(imageVectors)
      .values({
        imageId: imageRecord.id,
        descriptionVector: descriptionEmbedding
      })
      .onConflictDoUpdate({
        target: imageVectors.imageId,
        set: {
          descriptionVector: sql`excluded.description_vector`,
          imageVector: sql`excluded.image_vector`
        }
      });

    return NextResponse.json(
      { message: 'Image processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error processing image' },
      { status: 500 }
    );
  }
}
