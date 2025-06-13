import { getPhotosCached } from '@/photo/cache';
import { SITE_FEEDS_ENABLED } from '@/app/config';
import { FEED_PHOTO_REQUEST_LIMIT } from '@/feed';
import { formatFeedJson } from '@/feed/json';

// Cache for 24 hours
export const revalidate = 86_400;

export async function GET() {
  if (SITE_FEEDS_ENABLED) {
    const photos = await getPhotosCached({
      limit: FEED_PHOTO_REQUEST_LIMIT,
      sortBy: 'createdAt',
    }).catch(() => []);
    return Response.json(formatFeedJson(photos));
  } else {
    return new Response('Feeds disabled', { status: 404 });
  }
}
