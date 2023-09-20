import { auth } from '@/auth';
import { getImageCacheHeadersForAuth } from '@/cache';
import { IMAGE_OG_SIZE } from '@/photo/image-response';
import PhotoImageResponse from '@/photo/image-response/PhotoImageResponse';
import { getPhoto } from '@/services/postgres';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request, context: any){
  const photo = await getPhoto(context.params.photoId);

  const {
    fontFamily,
    fonts,
  } = await getIBMPlexMonoMedium();
  
  const headers = await getImageCacheHeadersForAuth(await auth());
  
  if (!photo) { return new Response('Photo not found', { status: 404 }); }

  const { width, height } = IMAGE_OG_SIZE;
  
  return new ImageResponse(
    <PhotoImageResponse {...{ photo, request, width, height, fontFamily }} />,
    { width, height, fonts, headers },
  ) as Response;
}
