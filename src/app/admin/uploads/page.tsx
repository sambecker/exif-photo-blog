import { getStorageUploadUrlsNoStore } from '@/platforms/storage/cache';
import SiteGrid from '@/components/SiteGrid';
import { getUniqueTagsCached } from '@/photo/cache';
import AdminUploadsClient from '@/admin/AdminUploadsClient';

export const maxDuration = 60;

export default async function AdminUploadsPage() {
  const urls = await getStorageUploadUrlsNoStore();
  const uniqueTags = await getUniqueTagsCached();
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
