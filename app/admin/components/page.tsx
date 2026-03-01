import AdminComponentPageClient from '@/admin/AdminComponentPageClient';
import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getPhotosCached, getPhotosMetaCached } from '@/photo/cache';
import { TAG_FAVS } from '@/tag';

export default async function ComponentsPage() {
  const photos = await getPhotosCached({ limit: INFINITE_SCROLL_GRID_INITIAL });
  const photosCount = await getPhotosMetaCached()
    .then(({ count }) => count);
  const photosFavs = await getPhotosCached({ tag: TAG_FAVS });

  return (
    <AdminComponentPageClient
      photo={photos[0]}
      photos={photos}
      photosCount={photosCount}
      photosFavs={photosFavs}
    />
  );
}
