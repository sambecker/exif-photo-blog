import StorageUrls from '@/admin/StorageUrls';
import { getStorageUploadUrlsNoStore } from '@/services/storage/cache';
import SiteGrid from '@/components/SiteGrid';

export default async function AdminUploadsPage() {
  const storageUrls = await getStorageUploadUrlsNoStore();
  return (
    <SiteGrid
      contentMain={<StorageUrls urls={storageUrls} />}
    />
  );
}
