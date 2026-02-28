import AdminComponentPageClient from '@/admin/AdminComponentPageClient';
import { getPhotosCached } from '@/photo/cache';

export default async function ComponentsPage() {
  const photos = await getPhotosCached({ limit: 1});

  return (
    <AdminComponentPageClient photo={photos[0]} />
  );
}
