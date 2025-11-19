'use cache';

import { SITE_FEEDS_ENABLED } from '@/app/config';
import { formatFeedJson } from '@/feed/json';
import { PROGRAMMATIC_QUERY_OPTIONS } from '@/feed';
import { cacheTag } from 'next/cache';
import { getPhotos } from '@/photo/query';
import { KEY_PHOTOS } from '@/cache';

export async function GET() {
  cacheTag(KEY_PHOTOS);

  if (SITE_FEEDS_ENABLED) {
    const photos = await getPhotos(PROGRAMMATIC_QUERY_OPTIONS)
      .catch(() => []);
    return Response.json(formatFeedJson(photos));
  } else {
    return new Response('Feeds disabled', { status: 404 });
  }
}
