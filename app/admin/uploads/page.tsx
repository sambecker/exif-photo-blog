import { getStorageUploadUrlsNoStore } from '@/platforms/storage/cache';
import AppGrid from '@/components/AppGrid';
import { getUniqueTagsCached } from '@/photo/cache';
import AdminUploadsClient from '@/admin/AdminUploadsClient';
import { redirect } from 'next/navigation';
import { PATH_ADMIN_PHOTOS } from '@/app/path';
import { getAlbumsWithMeta } from '@/album/query';

export const maxDuration = 60;

export default async function AdminUploadsPage() {
  const urls = await getStorageUploadUrlsNoStore();
  const uniqueAlbums = await getAlbumsWithMeta();
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
          }} />}
      />
    );
  }
}
