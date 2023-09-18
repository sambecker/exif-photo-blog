import { auth } from '@/auth';
import { getImageCacheHeadersForAuth } from '@/cache';
import {
  GRID_OG_SIZE,
  MAX_PHOTOS_TO_SHOW_TEMPLATE,
} from '@/photo/image-response';
import TemplateImageResponse from
  '@/photo/image-response/TemplateImageResponse';
import { getPhotos } from '@/services/postgres';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const photos = await getPhotos('priority', MAX_PHOTOS_TO_SHOW_TEMPLATE);
  const {
    fontFamily,
    fonts,
  } = await getIBMPlexMonoMedium();
  const headers = await getImageCacheHeadersForAuth(await auth());

  const { width, height } = GRID_OG_SIZE;
  
  return new ImageResponse(
    (
      <TemplateImageResponse {...{
        photos,
        request,
        width,
        height,
        fontFamily,
      }}/>
    ),
    { width, height, fonts, headers },
  );
}
