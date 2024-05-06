import { redirect } from 'next/navigation';
import { getPhotoNoStore, getUniqueTagsCached } from '@/photo/cache';
import { PATH_ADMIN } from '@/site/paths';
import PhotoEditPageClient from '@/photo/PhotoEditPageClient';
import { AI_TEXT_GENERATION_ENABLED } from '@/site/config';
import { resizeImageFromUrl } from '@/photo/server';
import { getNextImageUrlForRequest } from '@/services/next-image';

export default async function PhotoEditPage({
  params: { photoId },
}: {
  params: { photoId: string }
}) {
  const photo = await getPhotoNoStore(photoId);

  if (!photo) { redirect(PATH_ADMIN); }

  const uniqueTags = await getUniqueTagsCached();

  const hasAiTextGeneration = AI_TEXT_GENERATION_ENABLED;
  
  const imageThumbnailBase64 = await resizeImageFromUrl(
    getNextImageUrlForRequest(photo.url,  640),
  );

  return (
    <PhotoEditPageClient {...{
      photo,
      uniqueTags,
      hasAiTextGeneration,
      imageThumbnailBase64,
    }} />
  );
};
