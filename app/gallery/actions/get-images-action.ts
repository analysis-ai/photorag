'use server';

import { generateSasUrl } from '@/lib/azure-blob';
import { getImages } from '@/models/image';

export const action = async () => {
  const images = await getImages();

  return images.map((image) => {
    return {
      ...image,
      sasUrl: generateSasUrl(image.filename!, 7200)
    };
  });
};
