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
} from '@/app/paths';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import {
  getPhotosMetaCached,
  getPhotosNearIdCached,
} from '@/photo/cache';
import { cache } from 'react';
import {
  formatLensParams,
  getLensPhotoFromParams,
  lensFromPhoto,
  LensPhotoProps,
} from '@/lens';

const getPhotosNearIdCachedCached = cache((
  photoId: string,
  make: string | undefined,
  model: string,
) =>
  getPhotosNearIdCached(
    photoId, {
      lens: formatLensParams({ make, model }),
      limit: RELATED_GRID_PHOTOS_TO_SHOW + 2,
    },
  ));

export async function generateMetadata({
  params,
}: LensPhotoProps): Promise<Metadata> {
  const { photoId, make, model } = await getLensPhotoFromParams(params);

  const { photo } = await getPhotosNearIdCachedCached(photoId, make, model);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const descriptionHtml = descriptionForPhoto(photo, true);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto({
    photo,
    lens: lensFromPhoto(photo, { make, model }),
  });

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
  };
}

export default async function PhotoLensPage({
  params,
}: LensPhotoProps) {
  const { photoId, make, model } = await getLensPhotoFromParams(params);

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCachedCached(photoId, make, model);

  if (!photo) { redirect(PATH_ROOT); }

  const lens = lensFromPhoto(photo, { make, model });

  const { count, dateRange } = await getPhotosMetaCached({ lens });

  return (
    <PhotoDetailPage {...{
      photo,
      photos,
      photosGrid,
      lens,
      indexNumber,
      count,
      dateRange,
    }} />
  );
}
