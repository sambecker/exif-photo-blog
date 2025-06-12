import { getPhotosCached } from '@/photo/cache';
import {
  BASE_URL,
  SITE_FEEDS_ENABLED,
  META_TITLE,
} from '@/app/config';
import { FEED_PHOTO_REQUEST_LIMIT, formatPhotoForFeedJson } from '@/app/feed';

export const dynamic = 'force-static';

export async function GET() {
  if (SITE_FEEDS_ENABLED) {
    const photos = await getPhotosCached({
      limit: FEED_PHOTO_REQUEST_LIMIT,
      sortBy: 'createdAt',
    });
    return Response.json({
      meta: {
        title: META_TITLE,
        url: BASE_URL,
      },
      photos: photos.map(formatPhotoForFeedJson),
    });
  } else {
    return new Response('Feed disabled', { status: 404 });
  }
}
