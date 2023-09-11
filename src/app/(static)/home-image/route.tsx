import { auth } from '@/auth';
import { getImageCacheHeadersForAuth } from '@/cache';
import HomeImageResponse from '@/photo/image-response/HomeImageResponse';
import { getPhotos } from '@/services/postgres';
import { IMAGE_OG_HEIGHT, IMAGE_OG_WIDTH } from '@/site';
import { FONT_FAMILY_IBM_PLEX_MONO, getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const photos = await getPhotos();
  const fontData = await getIBMPlexMonoMedium();
  const headers = await getImageCacheHeadersForAuth(await auth());

  return new ImageResponse(
    (
      <HomeImageResponse {...{
        photos,
        request,
        includeHeader: false,
        outerMargin: 0,
        width: IMAGE_OG_WIDTH,
        height: IMAGE_OG_HEIGHT,
        fontFamily: FONT_FAMILY_IBM_PLEX_MONO,
      }}/>
    ),
    {
      width: IMAGE_OG_WIDTH,
      height: IMAGE_OG_HEIGHT,
      fonts: [
        {
          name: FONT_FAMILY_IBM_PLEX_MONO,
          data: fontData,
          style: 'normal',
        },
      ],
      headers,
    },
  );
}
