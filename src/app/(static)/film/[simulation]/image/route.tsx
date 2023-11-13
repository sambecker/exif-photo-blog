import { auth } from '@/auth';
import { getImageCacheHeadersForAuth, getPhotosCached } from '@/cache';
import {
  IMAGE_OG_SMALL_SIZE,
  MAX_PHOTOS_TO_SHOW_PER_TAG,
} from '@/photo/image-response';
import FilmSimulationImageResponse from
  '@/photo/image-response/FilmSimulationImageResponse';
import { FilmSimulation } from '@/simulation';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from 'next/og';

export async function GET(
  _: Request,
  context: { params: { simulation: FilmSimulation } },
) {
  const { simulation } = context.params;

  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_PER_TAG, simulation }),
    getIBMPlexMonoMedium(),
    getImageCacheHeadersForAuth(await auth()),
  ]);

  const { width, height } = IMAGE_OG_SMALL_SIZE;

  return new ImageResponse(
    <FilmSimulationImageResponse {...{
      simulation,
      photos,
      width,
      height,
      fontFamily,
    }}/>,
    { width, height, fonts, headers },
  );
}
