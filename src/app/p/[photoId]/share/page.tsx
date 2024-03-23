import { GRID_THUMBNAILS_TO_SHOW_MAX } from '@/photo';
import { getPhotosNearIdCachedCached } from '@/photo/cache';
import PhotoShareModal from '@/photo/PhotoShareModal';
import { PATH_ROOT } from '@/site/paths';
import { redirect } from 'next/navigation';

export default async function Share({
  params: { photoId },
}: {
  params: { photoId: string }
}) {
  const { photo } = await getPhotosNearIdCachedCached(
    photoId,
    // Matching common query from photo detail page
    // in order to reuse cached results
    GRID_THUMBNAILS_TO_SHOW_MAX + 2,
  );

  if (!photo) { return redirect(PATH_ROOT); }

  return <PhotoShareModal photo={photo} />;
}
