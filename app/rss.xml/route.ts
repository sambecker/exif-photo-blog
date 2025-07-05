import { getPhotosCached } from '@/photo/cache';
import { SITE_FEEDS_ENABLED } from '@/app/config';
import { formatFeedRssXml } from '@/feed/rss';
import { PROGRAMMATIC_QUERY_OPTIONS } from '@/feed';

// Cache for 24 hours
export const revalidate = 86_400;

export async function GET() {
  if (SITE_FEEDS_ENABLED) {
    const photos = await getPhotosCached(PROGRAMMATIC_QUERY_OPTIONS)
      .catch(() => []);
    return new Response(
      formatFeedRssXml(photos),
      { headers: { 'Content-Type': 'text/xml' } },
    );
  } else {
    return new Response('Feeds disabled', { status: 404 });
  }
}
