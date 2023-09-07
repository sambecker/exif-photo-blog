import { getImageCacheHeadersForAuth } from '@/cache';
import PhotoOGImageResponse from '@/photo/image-response/PhotoOGImageResponse';
import { getPhoto } from '@/services/postgres';
import { IMAGE_OG_WIDTH, IMAGE_OG_HEIGHT } from '@/site';
import { FONT_FAMILY_IBM_PLEX_MONO, getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request, context: any) {
  const photo = await getPhoto(context.params.photoId);
  const fontData = await getIBMPlexMonoMedium();
  const headers = await getImageCacheHeadersForAuth();
  
  if (!photo) { return null; }
  
  return new ImageResponse(
    (
      <PhotoOGImageResponse
        photo={photo}
        requestOrPhotoPath={request}
        width={IMAGE_OG_WIDTH}
        height={IMAGE_OG_HEIGHT}
        fontFamily={FONT_FAMILY_IBM_PLEX_MONO}
      />
    ),
    {
      width: IMAGE_OG_WIDTH,
      height: IMAGE_OG_HEIGHT,
      fonts: [
        {
          name: FONT_FAMILY_IBM_PLEX_MONO,
          data: fontData,
          weight: 500,
          style: 'normal',
        },
      ],
      headers,
    },
  );
}
