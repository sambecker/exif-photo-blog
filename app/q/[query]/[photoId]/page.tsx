import {
  RELATED_GRID_PHOTOS_TO_SHOW,
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { Metadata } from 'next/types';
import { redirect } from 'next/navigation';
import {
  PATH_ROOT,
  absolutePathForPhoto,
  absolutePathForPhotoImage,
} from '@/app/path';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import {
  getPhotosMetaCached,
  getPhotosNearIdCached,
} from '@/photo/cache';
import { cache } from 'react';

const getPhotosNearIdCachedCached = cache((photoId: string, query: string) =>
  getPhotosNearIdCached(
    photoId,
    { query, limit: RELATED_GRID_PHOTOS_TO_SHOW + 2 },
  ));

interface PhotoQueryProps {
  params: Promise<{ photoId: string, query: string }>
}

export async function generateMetadata({
  params,
}: PhotoQueryProps): Promise<Metadata> {
  const { photoId, query: queryFromParams } = await params;

  const query = decodeURIComponent(queryFromParams);

  const { photo } = await getPhotosNearIdCachedCached(photoId, query);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const descriptionHtml = descriptionForPhoto(photo, true);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto({ photo, query });

  return {
    title,
    description: descriptionHtml,
    openGraph: {
      title,
      images,
      description,
      url,
    },
    twitter: {
      title,
      description,
      images,
      card: 'summary_large_image',
    },
    // Results are derived from other pages, so keep them out of search indexes
    robots: { index: false },
  };
}

export default async function PhotoQueryPage({
  params,
}: PhotoQueryProps) {
  const { photoId, query: queryFromParams } = await params;

  const query = decodeURIComponent(queryFromParams);

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCachedCached(photoId, query);

  if (!photo) { redirect(PATH_ROOT); }

  const { count, dateRange } = await getPhotosMetaCached({ query });

  return (
    <PhotoDetailPage {...{
      photo,
      photos,
      photosGrid,
      query,
      indexNumber,
      count,
      dateRange,
    }} />
  );
}
