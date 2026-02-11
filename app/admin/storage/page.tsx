import AdminInfoPage from '@/admin/AdminInfoPage';
import { pathForPhoto } from '@/app/path';
import LinkWithStatus from '@/components/LinkWithStatus';
import { Photo } from '@/photo';
import { getPhotoUrls } from '@/photo/query';
import { getStorageUrlsForPhoto } from '@/photo/storage';

export default async function AdminStoragePage() {
  const _urls = await getPhotoUrls({ limit: 1000, hidden: 'include' });
  const urls = await Promise.all(_urls.map(async ({ id, title, url }) => {
    const urlSet = await getStorageUrlsForPhoto({ url } as Photo);
    const isAvailable = urlSet.length > 0;
    return { id, title, isAvailable };
  }));
  const countAvailable = urls.filter(url => url.isAvailable).length;
  return <AdminInfoPage title={`URLs (${urls.length})`}>
    <div className="w-full space-y-4">
      <div>
        <div className="font-bold">
          Storage ({countAvailable}/{urls.length})
        </div>
        <div>{urls.length - countAvailable} missing</div>
      </div>
      <div>
        {urls.map(({ id, title, isAvailable }) => (
          <div
            key={id}
          >
            <LinkWithStatus
              href={pathForPhoto({ photo: id })}
              className="w-full inline-flex items-center gap-1"
            >
              <span className="w-[15rem] inline-block truncate">{title}</span>
              {isAvailable ? '✅' : '❌'}
            </LinkWithStatus>
          </div>
        ))}
      </div>
    </div>
  </AdminInfoPage>;
}
