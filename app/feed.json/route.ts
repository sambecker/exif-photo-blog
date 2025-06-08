import { getPhotosCached } from '@/photo/cache';
import { INFINITE_SCROLL_FEED_INITIAL } from '@/photo';
import { formatPhotoForFeed } from '@/app/feed';
import {
  BASE_URL,
  PUBLIC_FEED_ENABLED,
  META_TITLE,
} from '@/app/config';

export const dynamic = 'force-static';

export async function GET() {
  if (PUBLIC_FEED_ENABLED) {
    const photos = await getPhotosCached({
      limit: INFINITE_SCROLL_FEED_INITIAL,
      sortBy: 'createdAt',
    });
    return Response.json({
      meta: {
        title: META_TITLE,
        url: BASE_URL,
      },
      photos: photos.map(formatPhotoForFeed),
    });
  } else {
    return new Response('Feed disabled', { status: 404 });
  }
}
