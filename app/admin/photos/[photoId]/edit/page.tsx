import { redirect } from 'next/navigation';
import { PATH_ADMIN } from '@/app/path';
import PhotoEditPageClient from '@/photo/PhotoEditPageClient';
import {
  AI_CONTENT_GENERATION_ENABLED,
  BLUR_ENABLED,
  IS_PREVIEW,
} from '@/app/config';
import { blurImageFromUrl, resizeImageFromUrl } from '@/photo/server';
import {
  getOptimizedPhotoUrlForManipulation,
  getStorageUrlsForPhoto,
} from '@/photo/storage';
import { getAlbumsWithMeta, getAlbumTitlesForPhoto } from '@/album/query';
import {
  getPhoto,
  getUniqueFilms,
  getUniqueRecipes,
  getUniqueTags,
} from '@/photo/query';

export default async function PhotoEditPage({
  params,
}: {
  params: Promise<{ photoId: string }>
}) {
  const { photoId } = await params;

  const [
    photo,
    photoAlbumTitles,
    albums,
    uniqueTags,
    uniqueRecipes,
    uniqueFilms,
  ] = await Promise.all([
    getPhoto(photoId, true),
    getAlbumTitlesForPhoto(photoId),
    getAlbumsWithMeta(),
    getUniqueTags(),
    getUniqueRecipes(),
    getUniqueFilms(),
  ]);

  if (!photo) { redirect(PATH_ADMIN); }

  const photoStorageUrls = await getStorageUrlsForPhoto(photo);

  const hasAiTextGeneration = AI_CONTENT_GENERATION_ENABLED;
  
  // Only generate image thumbnails when AI generation is enabled
  const imageThumbnailBase64 = AI_CONTENT_GENERATION_ENABLED
    ? await resizeImageFromUrl(
      getOptimizedPhotoUrlForManipulation(photo.url, IS_PREVIEW),
    )
    : '';

  const blurData = BLUR_ENABLED
    ? await blurImageFromUrl(
      getOptimizedPhotoUrlForManipulation(photo.url, IS_PREVIEW),
    )
    : '';

  return (
    <PhotoEditPageClient {...{
      photo,
      photoStorageUrls,
      photoAlbumTitles,
      albums,
      uniqueTags,
      uniqueRecipes,
      uniqueFilms,
      hasAiTextGeneration,
      imageThumbnailBase64,
      blurData,
    }} />
  );
};
