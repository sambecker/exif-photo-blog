import BlobUrls from '@/admin/BlobUrls';
import { getBlobUploadUrlsNoStore } from '@/cache';
import SiteGrid from '@/components/SiteGrid';

export default async function UploadsPage() {
  const blobUrls = await getBlobUploadUrlsNoStore();
  return (
    <SiteGrid
      contentMain={<BlobUrls urls={blobUrls} />}
    />
  );
}
