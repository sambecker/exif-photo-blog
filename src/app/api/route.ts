import { getPhotosCached } from '@/photo/cache';
import { API_PHOTO_REQUEST_LIMIT, formatPhotoForApi } from '@/site/api';
import {
  BASE_URL,
  PUBLIC_API_ENABLED,
  SHOULD_USE_EDGE_RUNTIME,
  SITE_TITLE,
} from '@/site/config';

export let runtime: 'edge' | 'nodejs';
if (SHOULD_USE_EDGE_RUNTIME) { runtime = 'edge'; }

export async function GET() {
  if (PUBLIC_API_ENABLED) {
    const photos = await getPhotosCached({ limit: API_PHOTO_REQUEST_LIMIT });
    return Response.json({
      meta: {
        title: SITE_TITLE,
        url: BASE_URL,
      },
      photos: photos.map(formatPhotoForApi),
    });
  } else {
    return new Response('API access disabled', { status: 404 });
  }
}
