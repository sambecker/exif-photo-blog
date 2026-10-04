import { getStorageUploadUrlsNoStore } from '@/platforms/storage/cache';
import AppGrid from '@/components/AppGrid';
import { getUniqueTagsCached } from '@/photo/cache';
import { getAlbumsWithMetaCached } from '@/album/cache';
import AdminUploadsClient from '@/admin/AdminUploadsClient';
import { revalidatePath } from 'next/cache';
import { PRESERVE_ORIGINAL_UPLOADS } from '@/app/config';

export const maxDuration = 60;

export default async function AdminUploadsPage() {
  const urls = await getStorageUploadUrlsNoStore();

  const [uniqueAlbums, uniqueTags] = urls.length > 0
    ? await Promise.all([
      getAlbumsWithMetaCached(),
      getUniqueTagsCached(),
    ])
    : [[], []];

  return (
    <AppGrid
      contentMain={
        <AdminUploadsClient {...{
          urls,
          uniqueAlbums,
          uniqueTags,
          shouldResize: !PRESERVE_ORIGINAL_UPLOADS,
          onLastUpload: async () => {
            'use server';
            // Refresh admin after new uploads land
            revalidatePath('/admin', 'layout');
          },
        }} />}
    />
  );
}
