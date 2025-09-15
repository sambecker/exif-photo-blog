import AdminAlbumsTable from '@/admin/AdminAlbumsTable';
import { getAlbumsWithMeta } from '@/album/query';
import AppGrid from '@/components/AppGrid';

export default async function AdminTagsPage() {
  const albums = await getAlbumsWithMeta();

  return (
    <AppGrid
      contentMain={
        <div className="space-y-6">
          <div className="space-y-4">
            <AdminAlbumsTable {...{ albums }} />
          </div>
        </div>}
    />
  );
}
