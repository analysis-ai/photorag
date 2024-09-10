import { images } from '@/db/schema';

export type ImageType = typeof images.$inferSelect;
export type ImageInput = typeof images.$inferInsert;
