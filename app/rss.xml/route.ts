import { SITE_FEEDS_ENABLED } from '@/app/config';
import { formatFeedRssXml } from '@/feed/rss';
import { PROGRAMMATIC_QUERY_OPTIONS } from '@/feed';
import { KEY_PHOTOS } from '@/cache';
import { cacheTag } from 'next/cache';
import { getPhotos } from '@/photo/query';

async function getCacheComponent() {
  'use cache';
  cacheTag(KEY_PHOTOS);

  return getPhotos(PROGRAMMATIC_QUERY_OPTIONS);
}

export async function GET() {
  if (SITE_FEEDS_ENABLED) {
    const photos = await getCacheComponent()
      .catch(() => []);
    return new Response(
      formatFeedRssXml(photos),
      { headers: { 'Content-Type': 'text/xml' } },
    );
  } else {
    return new Response('Feeds disabled', { status: 404 });
  }
}
