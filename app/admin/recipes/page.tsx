import AdminTagTable from '@/admin/AdminTagTable';
import SiteGrid from '@/components/SiteGrid';
import { getUniqueTagsHiddenCached } from '@/photo/cache';

export default async function AdminTagsPage() {
  const tags = await getUniqueTagsHiddenCached().catch(() => []);

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-6">
          <div className="space-y-4">
            <AdminTagTable {...{ tags }} />
          </div>
        </div>}
    />
  );
}
