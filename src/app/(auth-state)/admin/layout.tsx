import AdminNav from '@/admin/AdminNav';
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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [
    countPhotos,
    countUploads,
    countTags,
  ] = await Promise.all([
    getPhotosCountIncludingHiddenCached(),
    getBlobUploadUrlsNoStore().then(urls => urls.length),
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
    <div className="mt-4 space-y-5">
      <AdminNav items={navItems} />
      {children}
    </div>
  );
}
