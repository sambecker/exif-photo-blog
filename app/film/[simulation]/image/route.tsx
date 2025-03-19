import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import FilmSimulationImageResponse from
  '@/image-response/FilmSimulationImageResponse';
import { FilmSimulation } from '@/simulation';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { getUniqueFilmSimulations } from '@/photo/db/query';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'films',
  'image',
  getUniqueFilmSimulations,
  simulations => simulations.map(({ simulation }) => ({ simulation })),
);

export async function GET(
  _: Request,
  context: { params: Promise<{ simulation: FilmSimulation }> },
) {
  const { simulation } = await context.params;

  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY, simulation }),
    getIBMPlexMono(),
    getImageResponseCacheControlHeaders(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

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
