import {
  getBlobUploadUrlsNoStore,
  getPhotosCountIncludingHiddenCached,
  getUniqueTagsCached,
} from '@/cache';
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
  ] = await Promise.all([
    getPhotosCountIncludingHiddenCached(),
    getBlobUploadUrlsNoStore()
      .then(urls => urls.length)
      .catch(e => {
        console.error(`Error getting blob upload urls: ${e}`);
        return 0;
      }),
    getUniqueTagsCached().then(tags => tags.length),
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

  const navItems = [navItemPhotos];

  if (countUploads > 0) { navItems.push(navItemUploads); }
  if (countTags > 0) { navItems.push(navItemTags); }

  return (
    <AdminNavClient items={navItems} />
  );
}
