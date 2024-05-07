import AdminUploadsTable from '@/admin/AdminUploadsTable';
import { getStorageUploadUrlsNoStore } from '@/services/storage/cache';
import SiteGrid from '@/components/SiteGrid';

export default async function AdminUploadsPage() {
  const storageUrls = await getStorageUploadUrlsNoStore();
  return (
    <SiteGrid
      contentMain={<AdminUploadsTable urls={storageUrls} />}
    />
  );
}
