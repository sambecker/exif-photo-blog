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
import { getPhotosMetaCached, getPhotosNearIdCached } from '@/photo/cache';
import { cache } from 'react';

const getPhotosNearIdCachedCached = cache((
  photoId: string,
  recipe: string,
) =>
  getPhotosNearIdCached(
    photoId,
    { recipe, limit: RELATED_GRID_PHOTOS_TO_SHOW + 2 },
  ));

interface PhotoRecipeProps {
  params: Promise<{ photoId: string, recipe: string }>
}

export async function generateMetadata({
  params,
}: PhotoRecipeProps): Promise<Metadata> {
  const { photoId, recipe: recipeFromParams } = await params;

  const recipe = decodeURIComponent(recipeFromParams);

  const { photo } = await getPhotosNearIdCachedCached(photoId, recipe);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto({ photo, recipe });

  return {
    title,
    description,
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

export default async function PhotoRecipePage({
  params,
}: PhotoRecipeProps) {
  const { photoId, recipe: recipeFromParams } = await params;

  const recipe = decodeURIComponent(recipeFromParams);

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCachedCached(photoId, recipe);

  if (!photo) { redirect(PATH_ROOT); }

  const { count, dateRange } = await getPhotosMetaCached({ recipe });

  return (
    <PhotoDetailPage {...{
      photo,
      photos,
      photosGrid,
      recipe,
      indexNumber,
      count,
      dateRange,
    }} />
  );
}
