import AdminAlbumsTable from '@/admin/AdminAlbumsTable';
import AdminEmptyState from '@/admin/AdminEmptyState';
import AdminPageHeader from '@/admin/AdminPageHeader';
import { getAlbumsWithMeta } from '@/album/query';
import { PATH_ADMIN_ALBUM_NEW } from '@/app/path';
import AppGrid from '@/components/AppGrid';
import IconAlbum from '@/components/icons/IconAlbum';
import { getAppText } from '@/i18n/state/server';
import Link from 'next/link';

export default async function AdminTagsPage() {
  const [albums, appText] = await Promise.all([
    getAlbumsWithMeta(),
    getAppText(),
  ]);

  return (
    <AppGrid
      contentMain={
        <div className="space-y-6">
          <div className="space-y-4">
            <AdminPageHeader
              count={albums.length}
              singular={appText.category.album}
              plural={appText.category.albumPlural}
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
            />
            {albums.length === 0
              ? <AdminEmptyState icon={<IconAlbum size={28} />}>
                <div className="max-w-xs text-center space-y-1">
                  <div className="font-bold">
                    No albums
                  </div>
                  <div className="text-dim">
                    Albums are collections of photos with associated metadata
                    like descriptions and locations
                  </div>
                </div>
              </AdminEmptyState>
              : <AdminAlbumsTable {...{ albums }} />}
          </div>
        </div>}
    />
  );
}
