import { similaritySearch } from '@/lib/similarity-search';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const headersList = headers();
  const apiKey = headersList.get('x-api-key');

  if (apiKey !== process.env.PHOTOMUSE_API_KEY) {
    return NextResponse.json({ message: 'Invalid API key' }, { status: 401 });
  }

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
          return {
            id: result.id,
            filePath: result.filePath,
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
      { message: 'Error searching', error: (error as Error).message },
      { status: 500 }
    );
  }
}
