import { SITE_FEEDS_ENABLED } from '@/app/config';
import { formatFeedJson } from '@/feed/json';
import { PROGRAMMATIC_QUERY_OPTIONS } from '@/feed';
import { cacheTag } from 'next/cache';
import { getPhotos } from '@/photo/query';
import { KEY_PHOTOS } from '@/cache';

async function getPhotosCached() {
  'use cache';
  cacheTag(KEY_PHOTOS);

  return getPhotos(PROGRAMMATIC_QUERY_OPTIONS);
}

export async function GET() {
  if (SITE_FEEDS_ENABLED) {
    const photos = await getPhotosCached()
      .catch(() => []);
    return Response.json(formatFeedJson(photos));
  } else {
    return new Response('Feeds disabled', { status: 404 });
  }
}
