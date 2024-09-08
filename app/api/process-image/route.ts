import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding, processImage } from '@/lib/image-processing';
import { imageVectors, images } from '@/db/schema';

import { db } from '@/db';
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

    // Use the SAS URL (imageUrl) directly in processImage
    const { basicDescription, detailedDescription, tags } =
      await processImage(imageUrl);

    console.log('Basic Description:', basicDescription);
    console.log('Detailed Description:', detailedDescription);
    console.log('Tags:', tags);

    // Remove SAS token from URL before storing in database
    const blobUrl = imageUrl.split('?')[0];

    // Insert image into database
    const [imageRecord] = await db
      .insert(images)
      .values({
        filePath: blobUrl,
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

    console.log('Image record:', imageRecord);

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
    console.error('Error processing image:', error);
    return NextResponse.json(
      {
        message: 'Error processing image',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
