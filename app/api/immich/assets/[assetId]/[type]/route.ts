import { NextRequest, NextResponse } from 'next/server';
import {
  IMMICH_BASE_URL,
  IMMICH_SHARE_KEY,
} from '@/app/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assetId: string; type: string }> },
) {
  // type = original, need IMMICH allow public user to download
  const { assetId, type } = await params;
  const { searchParams } = request.nextUrl;
  if (type !== 'thumbnail' && type !== 'original') {
    return new NextResponse('Invalid type parameter', { status: 400 });
  }
  if (!assetId) {
    return new NextResponse('Asset ID is required', { status: 400 });
  }
  if (!IMMICH_BASE_URL) {
    return new NextResponse('Immich server configuration is missing', {
      status: 500,
    });
  }

  const immichUrl = new URL(
    `/api/assets/${assetId}/${type}`,
    IMMICH_BASE_URL,
  );

  if (type == 'thumbnail') {
    const size = searchParams.get('size') || 'preview';
    immichUrl.searchParams.append('size', size);
  }

  const sharedKey = searchParams.get('key') || IMMICH_SHARE_KEY || '';
  immichUrl.searchParams.append('key', sharedKey);

  try {

    const immichResponse = await fetch(immichUrl.toString(), {
      headers: {
      },
      next: {
        revalidate: 10,
      },
    });

    if (!immichResponse.ok) {
      return new NextResponse(immichResponse.statusText, {
        status: immichResponse.status,
      });
    }


    const imageStream = immichResponse.body;
    const contentType = immichResponse.headers.get('content-type');

    const response = new NextResponse(imageStream);
    if (contentType) {
      response.headers.set('content-type', contentType);
    }

    return response;
  } catch (error) {
    return new NextResponse('Error proxying request to Immich', {
      status: 500,
      statusText: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}