import AdminComponentPageClient from '@/admin/AdminComponentPageClient';
import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getPhotosCached, getPhotosMetaCached } from '@/photo/cache';

export default async function ComponentsPage() {
  const photos = await getPhotosCached({ limit: INFINITE_SCROLL_GRID_INITIAL });
  const photosCount = await getPhotosMetaCached()
    .then(({ count }) => count);

  return (
    <AdminComponentPageClient
      photo={photos[0]}
      photos={photos}
      photosCount={photosCount}
    />
  );
}
