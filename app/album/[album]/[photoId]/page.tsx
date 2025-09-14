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
import { getPhotosMetaCached, getPhotosNearIdCached } from '@/photo/cache';
import { cache } from 'react';
import { getAlbumFromSlug } from '@/album/query';

const getPhotosNearIdCachedCached = cache((photoId: string, album: string) =>
  getPhotosNearIdCached(
    photoId,
    { album, limit: RELATED_GRID_PHOTOS_TO_SHOW + 2 },
  ));

interface PhotoTagProps {
  params: Promise<{ photoId: string, album: string }>
}

export async function generateMetadata({
  params,
}: PhotoTagProps): Promise<Metadata> {
  const { photoId, album: albumFromParams } = await params;

  const albumSlug = decodeURIComponent(albumFromParams);

  const album = await getAlbumFromSlug(albumSlug);

  const { photo } = await getPhotosNearIdCachedCached(photoId, album.id);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const descriptionHtml = descriptionForPhoto(photo, true);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto({ photo, album: album.slug });

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

export default async function PhotoAlbumPage({
  params,
}: PhotoTagProps) {
  const { photoId, album: albumFromParams } = await params;

  const albumSlug = decodeURIComponent(albumFromParams);

  const album = await getAlbumFromSlug(albumSlug);

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCachedCached(photoId, album.id);

  if (!photo) { redirect(PATH_ROOT); }

  const { count, dateRange } = await getPhotosMetaCached({ album: album.id });

  return (
    <PhotoDetailPage {...{
      photo,
      photos,
      photosGrid,
      album: album.slug,
      indexNumber,
      count,
      dateRange,
    }} />
  );
}
