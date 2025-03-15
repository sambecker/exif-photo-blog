import AdminTagTable from '@/admin/AdminTagTable';
import SiteGrid from '@/components/SiteGrid';
import { getUniqueTags } from '@/photo/db/query';

export default async function AdminTagsPage() {
  const tags = await getUniqueTags().catch(() => []);

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
