import { images } from '@/db/schema';

export type ImageType = typeof images.$inferSelect;
export type ImageWithUrl = ImageType & { sasUrl: string };
export type ImageInput = typeof images.$inferInsert;
