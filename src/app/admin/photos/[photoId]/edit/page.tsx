import { redirect } from 'next/navigation';
import { getPhotoNoStore, getUniqueTagsCached } from '@/photo/cache';
import { PATH_ADMIN } from '@/app-core/paths';
import PhotoEditPageClient from '@/photo/PhotoEditPageClient';
import {
  AI_TEXT_GENERATION_ENABLED,
  BLUR_ENABLED,
  IS_PREVIEW,
} from '@/app-core/config';
import { blurImageFromUrl, resizeImageFromUrl } from '@/photo/server';
import { getNextImageUrlForManipulation } from '@/services/next-image';

export default async function PhotoEditPage({
  params,
}: {
  params: Promise<{ photoId: string }>
}) {
  const { photoId } = await params;

  const photo = await getPhotoNoStore(photoId, true);

  if (!photo) { redirect(PATH_ADMIN); }

  const uniqueTags = await getUniqueTagsCached();

  const hasAiTextGeneration = AI_TEXT_GENERATION_ENABLED;
  
  // Only generate image thumbnails when AI generation is enabled
  const imageThumbnailBase64 = AI_TEXT_GENERATION_ENABLED
    ? await resizeImageFromUrl(
      getNextImageUrlForManipulation(photo.url, IS_PREVIEW),
    )
    : '';

  const blurData = BLUR_ENABLED
    ? await blurImageFromUrl(
      getNextImageUrlForManipulation(photo.url, IS_PREVIEW),
    )
    : '';

  return (
    <PhotoEditPageClient {...{
      photo,
      uniqueTags,
      hasAiTextGeneration,
      imageThumbnailBase64,
      blurData,
    }} />
  );
};
