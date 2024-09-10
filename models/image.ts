import { db } from '@/db';
import { images } from '@/db/schema';
import { ImageInput, ImageType } from '@/types/image';
import { sql } from 'drizzle-orm';

export async function addImage(input: ImageInput): Promise<ImageType> {
  const [image] = await db
    .insert(images)
    .values(input)
    .onConflictDoUpdate({
      target: images.filePath,
      set: {
        caption: sql`excluded.caption`,
        description: sql`excluded.description`,
        descriptionVector: sql`excluded.description_vector`,
        filename: sql`excluded.filename`,
        imageVector: sql`excluded.image_vector`,
        metadata: sql`excluded.metadata`,
        tags: sql`excluded.tags`,
        vectorModel: sql`excluded.vector_model`
      }
    })
    .returning();
  return image;
}
