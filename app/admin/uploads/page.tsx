import { getStorageUploadUrlsNoStore } from '@/platforms/storage/cache';
import SiteGrid from '@/components/SiteGrid';
import { getUniqueTagsCached } from '@/photo/cache';
import AdminUploadsClient from '@/admin/AdminUploadsClient';
import { redirect } from 'next/navigation';
import { PATH_ADMIN_PHOTOS } from '@/app/paths';

export const maxDuration = 60;

export default async function AdminUploadsPage() {
  const urls = await getStorageUploadUrlsNoStore();
  const uniqueTags = await getUniqueTagsCached();

  if (urls.length === 0) {
    redirect(PATH_ADMIN_PHOTOS);
  } else {
    return (
      <SiteGrid
        contentMain={
          <AdminUploadsClient {...{
            urls,
            uniqueTags,
          }} />}
      />
    );
  }
}
