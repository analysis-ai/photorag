import {
  BlobSASPermissions,
  BlobServiceClient,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential
} from '@azure/storage-blob';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';
const CONTAINER_NAME = 'images';

const sharedKeyCredential = new StorageSharedKeyCredential(
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_KEY
);
const blobServiceClient = new BlobServiceClient(
  `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  sharedKeyCredential
);

export async function POST(request: NextRequest) {
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  const formData = await request.formData();
  const files = formData.getAll('images') as File[];

  const uploadPromises = files.map(async (file) => {
    const blobName = `${uuidv4()}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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
      fileName: file.name,
      blobUrl: blockBlobClient.url,
      sasUrl: sasUrl
    };
  });

  try {
    const uploadResults = await Promise.all(uploadPromises);

    console.log('Files uploaded:', uploadResults);

    // Trigger image analysis and embedding storage
    await Promise.all(
      uploadResults.map((result) => {
        console.log('Triggering image processing:', result.sasUrl);
        return triggerImageProcessing(result.sasUrl);
      })
    );

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: uploadResults.map(({ fileName, blobUrl }) => ({
        fileName,
        blobUrl
      })) // Don't return sasUrl to client
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}

async function triggerImageProcessing(imageUrl: string) {
  try {
    const host = headers().get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const apiUrl = `${protocol}://${host}/api/process-image`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.PHOTOMUSE_API_KEY || ''
      },
      body: JSON.stringify({ imageUrl, userId: '1' })
    });

    if (!response.ok) {
      throw new Error(`Image processing failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Image processed:', result);
  } catch (error) {
    console.error('Error processing image:', error);
  }
}
