import {
  BlobSASPermissions,
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters
} from '@azure/storage-blob';
import { NextRequest, NextResponse } from 'next/server';

import { similaritySearch } from '@/lib/similarity-search';

const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';
const CONTAINER_NAME = 'images'; // Replace with your container name

const sharedKeyCredential = new StorageSharedKeyCredential(
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_KEY
);
const blobServiceClient = new BlobServiceClient(
  `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  sharedKeyCredential
);

function generateSasUrl(blobName: string): string {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body.query;
    const limit = body.limit ? parseInt(body.limit, 10) : undefined;

    if (typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json({ message: 'Invalid query' }, { status: 400 });
    }

    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
      return NextResponse.json({ message: 'Invalid limit' }, { status: 400 });
    }

    const results = await similaritySearch(query, limit);

    return NextResponse.json(
      {
        message: `Found ${results.length} results`,
        results: results.map((result) => {
          const blobName = result.filePath.split('/').pop() || '';
          const sasUrl = generateSasUrl(blobName);
          return {
            id: result.id,
            filePath: sasUrl, // Use the SAS URL instead of the original filePath
            description: result.description,
            tags: result.tags,
            userId: result.userId,
            created: result.created,
            updated: result.updated,
            distance: result.distance,
            confidence: result.confidence
          };
        })
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in image search:', error);
    return NextResponse.json(
      {
        message: 'Error searching',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
