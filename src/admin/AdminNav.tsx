import { getStorageUploadUrlsNoStore } from '@/services/storage/cache';
import {
  getPhotosCountIncludingHiddenCached,
  getPhotosMostRecentUpdateCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import {
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_UPLOADS,
} from '@/site/paths';
import AdminNavClient from './AdminNavClient';

export default async function AdminNav() {
  const [
    countPhotos,
    countUploads,
    countTags,
    mostRecentPhotoUpdateTime,
  ] = await Promise.all([
    getPhotosCountIncludingHiddenCached().catch(() => 0),
    getStorageUploadUrlsNoStore()
      .then(urls => urls.length)
      .catch(e => {
        console.error(`Error getting blob upload urls: ${e}`);
        return 0;
      }),
    getUniqueTagsCached().then(tags => tags.length).catch(() => 0),
    getPhotosMostRecentUpdateCached().catch(() => undefined),
  ]);

  const navItemPhotos = {
    label: 'Photos',
    href: PATH_ADMIN_PHOTOS,
    count: countPhotos,
  };

  const navItemUploads = {
    label: 'Uploads',
    href: PATH_ADMIN_UPLOADS,
    count: countUploads,
  };

  const navItemTags = {
    label: 'Tags',
    href: PATH_ADMIN_TAGS,
    count: countTags,
  };

  const items = [navItemPhotos];

  if (countUploads > 0) { items.push(navItemUploads); }
  if (countTags > 0) { items.push(navItemTags); }

  return (
    <AdminNavClient {...{ items, mostRecentPhotoUpdateTime }} />
  );
}
