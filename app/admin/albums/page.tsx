import AdminAlbumsTable from '@/admin/AdminAlbumsTable';
import AdminPageHeader from '@/admin/AdminPageHeader';
import { getAlbumsWithMeta } from '@/album/query';
import AppGrid from '@/components/AppGrid';
import { getAppText } from '@/i18n/state/server';

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
            />
            <AdminAlbumsTable {...{ albums }} />
          </div>
        </div>}
    />
  );
}
