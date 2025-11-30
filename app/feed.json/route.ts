import { SITE_FEEDS_ENABLED } from '@/app/config';
import { formatFeedJson } from '@/feed/json';
import { PROGRAMMATIC_QUERY_OPTIONS } from '@/feed';
import { getPhotos } from '@/photo/query';
import { cacheTagGlobal } from '@/cache';

async function getCacheComponent() {
  'use cache';
  cacheTagGlobal();

  const photos = await getPhotos(PROGRAMMATIC_QUERY_OPTIONS).catch(() => []);

  return formatFeedJson(photos);
}

export async function GET() {
  if (SITE_FEEDS_ENABLED) {
    const json = await getCacheComponent();
    return Response.json(json);
  } else {
    return new Response('Feeds disabled', { status: 404 });
  }
}
