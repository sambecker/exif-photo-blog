import AdminAlbumsTable from '@/admin/AdminAlbumsTable';
import EmptyState from '@/components/EmptyState';
import AdminPage from '@/admin/AdminPage';
import { getAlbumsWithMeta } from '@/album/query';
import { PATH_ADMIN_ALBUM_NEW } from '@/app/path';
import IconAlbum from '@/components/icons/IconAlbum';
import { getAppText } from '@/i18n/state/server';
import { pluralize } from '@/utility/string';
import Link from 'next/link';

export default async function AdminTagsPage() {
  const albums = await getAlbumsWithMeta().catch(() => []);
  
  const appText = await getAppText();

  return (
    <AdminPage
      title={pluralize(
        albums.length,
        appText.category.album,
        appText.category.albumPlural,
      )}
      accessory={<Link
        href={PATH_ADMIN_ALBUM_NEW}
        className="button primary"
      >
        <IconAlbum
          size={16}
          className="translate-y-[0.5px]"
        />
        Create Album
      </Link>}
    >
      {albums.length === 0
        ? <EmptyState icon={<IconAlbum size={28} />}>
          <div className="max-w-xs text-center space-y-1">
            <div className="font-bold">
              No albums
            </div>
            <div className="text-dim">
              Albums are collections of photos with associated metadata
              like descriptions and locations
            </div>
          </div>
        </EmptyState>
        : <AdminAlbumsTable {...{ albums }} />}
    </AdminPage>
  );
}
