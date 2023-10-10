import BlobUrls from '@/admin/BlobUrls';
import { getBlobUploadUrlsCached } from '@/cache';
import SiteGrid from '@/components/SiteGrid';

export default async function UploadsPage() {
  const blobUrls = await getBlobUploadUrlsCached();
  return (
    <SiteGrid
      contentMain={<BlobUrls urls={blobUrls} />}
    />
  );
}
