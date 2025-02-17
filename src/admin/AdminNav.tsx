import { getStorageUploadUrlsNoStore } from '@/platforms/storage/cache';
import {
  getPhotosMetaCached,
  getPhotosMostRecentUpdateCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import {
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_UPLOADS,
} from '@/app/paths';
import AdminNavClient from './AdminNavClient';

export default async function AdminNav() {
  const [
    countPhotos,
    countUploads,
    countTags,
    mostRecentPhotoUpdateTime,
  ] = await Promise.all([
    getPhotosMetaCached({ hidden: 'include' })
      .then(({ count }) => count)
      .catch(() => 0),
    getStorageUploadUrlsNoStore()
      .then(urls => urls.length)
      .catch(e => {
        console.error(`Error getting blob upload urls: ${e}`);
        return 0;
      }),
    getUniqueTagsCached().then(tags => tags.length).catch(() => 0),
    getPhotosMostRecentUpdateCached().catch(() => undefined),
  ]);

  const includeInsights = countPhotos > 0;

  // Photos
  const items = [{
    label: 'Photos',
    href: PATH_ADMIN_PHOTOS,
    count: countPhotos,
  }];

  // Uploads
  if (countUploads > 0) { items.push({
    label: 'Uploads',
    href: PATH_ADMIN_UPLOADS,
    count: countUploads,
  }); }

  // Tags
  if (countTags > 0) { items.push({
    label: 'Tags',
    href: PATH_ADMIN_TAGS,
    count: countTags,
  }); }

  return (
    <AdminNavClient {...{
      items,
      mostRecentPhotoUpdateTime,
      includeInsights,
    }} />
  );
}
