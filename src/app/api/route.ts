import { getPhotosCached } from '@/cache';
import { parsePhotoForApi } from '@/photo';
import {
  BASE_URL,
  PUBLIC_API_ENABLED,
  SITE_TITLE,
} from '@/site/config';

const API_PHOTO_LIMIT = 20;

export async function GET() {
  if (PUBLIC_API_ENABLED) {
    const photos = await getPhotosCached({ limit: API_PHOTO_LIMIT });
    return Response.json({
      meta: {
        title: SITE_TITLE,
        url: BASE_URL,
      },
      photos: photos.map(parsePhotoForApi),
    });
  } else {
    return Response.json({ message: 'API is disabled' });
  }
}
