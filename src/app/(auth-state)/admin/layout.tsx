import AdminNav from '@/admin/AdminNav';
import {
  getPhotosCountIncludingHiddenCached,
  getUniqueTagsCached,
} from '@/cache';
import { PATH_ADMIN_PHOTOS, PATH_ADMIN_TAGS } from '@/site/paths';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [
    photosCount,
    tagsCount,
  ] = await Promise.all([
    getPhotosCountIncludingHiddenCached(),
    getUniqueTagsCached().then(tags => tags.length),
  ]);

  const navItemPhotos = {
    label: 'Photos',
    href: PATH_ADMIN_PHOTOS,
    count: photosCount,
  };

  const navItemTags = {
    label: 'Tags',
    href: PATH_ADMIN_TAGS,
    count: tagsCount,
  };

  const navItems = tagsCount > 0
    ? [navItemPhotos, navItemTags]
    : [navItemPhotos];

  return (
    <div className="mt-4 space-y-5">
      <AdminNav items={navItems} />
      {children}
    </div>
  );
}
