import { resizeImage } from '@/lib/image-processing';
import { cleanFilename } from '@/lib/utils';
import {
  BlobSASPermissions,
  BlobServiceClient,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential
} from '@azure/storage-blob';

const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';
const CONTAINER_NAME = 'photos';

const sharedKeyCredential = new StorageSharedKeyCredential(
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_KEY
);
const blobServiceClient = new BlobServiceClient(
  `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  sharedKeyCredential
);

const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

export function generateSasUrl(blobName: string): string {
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blobClient = containerClient.getBlobClient(blobName);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: CONTAINER_NAME,
      blobName: blobName,
      permissions: BlobSASPermissions.parse('r'),
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000) // URL expires in 1 hour
    },
    sharedKeyCredential
  ).toString();

  return `${blobClient.url}?${sasToken}`;
}

async function uploadImageWithRetry(file: File, retryCount = 1) {
  const blobName = cleanFilename(file.name);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = await resizeImage(Buffer.from(arrayBuffer));

    await blockBlobClient.upload(buffer, buffer.length);

    // Generate SAS URL
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: CONTAINER_NAME,
        blobName: blobName,
        permissions: BlobSASPermissions.parse('r'),
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000) // URL expires in 1 hour
      },
      sharedKeyCredential
    ).toString();

    const sasUrl = `${blockBlobClient.url}?${sasToken}`;

    return {
      filename: blobName,
      blobUrl: blockBlobClient.url,
      sasUrl: sasUrl
    };
  } catch (error) {
    if (retryCount > 0) {
      console.log(
        `Upload failed for ${file.name}. Retrying... (${retryCount} retries left)`
      );
      return uploadImageWithRetry(file, retryCount - 1); // Retry once
    } else {
      console.error(`Upload failed for ${file.name} after retrying.`, error);
      throw error; // Rethrow the error after the retry fails
    }
  }
}

export async function uploadManyImages(files: File[]) {
  const uploadPromises = files.map((file) => uploadImageWithRetry(file));
  return Promise.all(uploadPromises);
}
