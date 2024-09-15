'use server';

import { uploadImageWithRetry, uploadManyImages } from '@/lib/azure-blob';
import { analyzeImage } from '@/lib/azure-computer-vision';
import { errorMessage } from '@/lib/utils';

export async function uploadImage(formData: FormData): Promise<string> {
  const file = formData.get('image') as File;
  const searchImageUpload = await uploadImageWithRetry(file, 1, true);
  return searchImageUpload.sasUrl;
}

export async function uploadImages(formData: FormData) {
  const files = formData.getAll('images') as File[];
  const userId = formData.get('userId');

  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const uploadResults = await uploadManyImages(files);

    console.log('Files uploaded:', uploadResults);

    // Trigger image analysis and embedding storage
    const images = await Promise.all(
      uploadResults.map((result) => {
        return analyzeImage(
          result.sasUrl,
          result.blobUrl,
          result.filename,
          Number(userId)
        );
      })
    );

    return { message: 'Files uploaded successfully', images };
  } catch (error) {
    console.error('Error uploading files:', errorMessage(error));
    throw new Error('File upload failed');
  }
}
