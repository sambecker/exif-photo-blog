import { getPhotosCached } from '@/photo/cache';
import { SITE_FEEDS_ENABLED } from '@/app/config';
import { FEED_PHOTO_REQUEST_LIMIT } from '@/feed';
import { formatFeedRss } from '@/feed/rss';

// Cache for 24 hours
export const revalidate = 86_400;

export async function GET() {
  if (SITE_FEEDS_ENABLED) {
    const photos = await getPhotosCached({
      limit: FEED_PHOTO_REQUEST_LIMIT,
      sortBy: 'createdAt',
    });

    return new Response(
      formatFeedRss(photos),
      { headers: { 'Content-Type': 'text/xml' } },
    );
  } else {
    return new Response('Feeds disabled', { status: 404 });
  }
}
