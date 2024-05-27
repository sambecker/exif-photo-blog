import AdminUploadsTable from '@/admin/AdminUploadsTable';
import { getStorageUploadUrlsNoStore } from '@/services/storage/cache';
import SiteGrid from '@/components/SiteGrid';
import AdminAddAllUploads from '@/admin/AdminAddAllUploads';
import { getUniqueTagsCached } from '@/photo/cache';

export const maxDuration = 60;

export default async function AdminUploadsPage() {
  const storageUrls = await getStorageUploadUrlsNoStore();
  const uniqueTags = await getUniqueTagsCached();
  return (
    <SiteGrid
      contentMain={<div className="space-y-4">
        {storageUrls.length > 1 &&
          <AdminAddAllUploads
            storageUrlCount={storageUrls.length}
            uniqueTags={uniqueTags}
          />}
        <AdminUploadsTable urls={storageUrls} />
      </div>}
    />
  );
}
