import { getStorageUploadUrlsNoStore } from '@/platforms/storage/cache';
import AppGrid from '@/components/AppGrid';
import { getUniqueTagsCached } from '@/photo/cache';
import { getAlbumsWithMetaCached } from '@/album/cache';
import AdminUploadsClient from '@/admin/AdminUploadsClient';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { PATH_ADMIN_PHOTOS } from '@/app/path';
import { PRESERVE_ORIGINAL_UPLOADS } from '@/app/config';

export const maxDuration = 60;

export default async function AdminUploadsPage() {
  const urls = await getStorageUploadUrlsNoStore();
  const uniqueAlbums = await getAlbumsWithMetaCached();
  const uniqueTags = await getUniqueTagsCached();

  if (urls.length === 0) {
    redirect(PATH_ADMIN_PHOTOS);
  } else {
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
              // Update upload visibility in admin nav
              revalidatePath('/admin', 'layout');
            },
          }} />}
      />
    );
  }
}
