'use cache';

import { SITE_FEEDS_ENABLED } from '@/app/config';
import { formatFeedRssXml } from '@/feed/rss';
import { PROGRAMMATIC_QUERY_OPTIONS } from '@/feed';
import { KEY_PHOTOS } from '@/cache';
import { cacheTag } from 'next/cache';
import { getPhotos } from '@/photo/query';

export async function GET() {
  cacheTag(KEY_PHOTOS);

  if (SITE_FEEDS_ENABLED) {
    const photos = await getPhotos(PROGRAMMATIC_QUERY_OPTIONS)
      .catch(() => []);
    return new Response(
      formatFeedRssXml(photos),
      { headers: { 'Content-Type': 'text/xml' } },
    );
  } else {
    return new Response('Feeds disabled', { status: 404 });
  }
}
