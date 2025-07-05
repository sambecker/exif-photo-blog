import { getPhotosCached } from '@/photo/cache';
import { SITE_FEEDS_ENABLED } from '@/app/config';
import { formatFeedJson } from '@/feed/json';
import { PROGRAMMATIC_QUERY_OPTIONS } from '@/feed';

// Cache for 24 hours
export const revalidate = 86_400;

export async function GET() {
  if (SITE_FEEDS_ENABLED) {
    const photos = await getPhotosCached(PROGRAMMATIC_QUERY_OPTIONS)
      .catch(() => []);
    return Response.json(formatFeedJson(photos));
  } else {
    return new Response('Feeds disabled', { status: 404 });
  }
}
