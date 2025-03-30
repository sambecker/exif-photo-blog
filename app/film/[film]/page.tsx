import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getUniqueFilms } from '@/photo/db/query';
import { FilmSimulation, generateMetaForFilm } from '@/film';
import FilmOverview from '@/film/FilmOverview';
import { getPhotosFilmDataCached } from '@/film/data';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { PATH_ROOT } from '@/app/paths';
import { redirect } from 'next/navigation';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';

const getPhotosFilmDataCachedCached =
  cache(getPhotosFilmDataCached);

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'films',
  'page',
  getUniqueFilms,
  films => films.map(({ film }) => ({ film })),
);

interface FilmProps {
  params: Promise<{ film: FilmSimulation }>
}

export async function generateMetadata({
  params,
}: FilmProps): Promise<Metadata> {
  const { film } = await params;

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosFilmDataCachedCached({
    film,
    limit: INFINITE_SCROLL_GRID_INITIAL,
  });

  if (photos.length === 0) { return {}; }

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForFilm(film, photos, count, dateRange);

  return {
    title,
    openGraph: {
      title,
      description,
      images,
      url,
    },
    twitter: {
      images,
      description,
      card: 'summary_large_image',
    },
    description,
  };
}

export default async function FilmPage({
  params,
}: FilmProps) {
  const { film } = await params;

  const [
    photos,
    { count, dateRange },
  ] =  await getPhotosFilmDataCachedCached({
    film,
    limit: INFINITE_SCROLL_GRID_INITIAL,
  });

  if (photos.length === 0) { redirect(PATH_ROOT); } 

  return (
    <FilmOverview {...{
      film,
      photos,
      count,
      dateRange,
    }} />
  );
}
