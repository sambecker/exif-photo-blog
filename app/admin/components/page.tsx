import AdminComponentPageClient from '@/admin/AdminComponentPageClient';
import { getPhotosCached, getPhotosMetaCached } from '@/photo/cache';

export default async function ComponentsPage() {
  const photos = await getPhotosCached({ limit: 50 });
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
