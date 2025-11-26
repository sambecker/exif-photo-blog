import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import FilmImageResponse from '@/film/FilmImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getPhotos, getUniqueFilms } from '@/photo/query';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { KEY_PHOTOS } from '@/cache';
import { cacheTag } from 'next/cache';

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'films',
  'image',
  getUniqueFilms,
  films => films.map(({ film }) => ({ film })),
);

async function getCacheComponent(film: string) {
  'use cache';
  cacheTag(KEY_PHOTOS);
  
  const [
    photos,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotos({
      limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
      film,
    }),
    getIBMPlexMono(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return new ImageResponse(
    <FilmImageResponse {...{
      film,
      photos,
      width,
      height,
      fontFamily,
    }}/>,
    { width, height, fonts },
  );
}

export async function GET(
  _: Request,
  context: { params: Promise<{ film: string }> },
) {
  const { film } = await context.params;

  return getCacheComponent(film);
}
