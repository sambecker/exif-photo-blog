import AdminTagsTable from '@/admin/AdminTagsTable';
import AppGrid from '@/components/AppGrid';
import { getUniqueTags } from '@/photo/query';

export default async function AdminTagsPage() {
  const tags = await getUniqueTags().catch(() => []);

  return (
    <AppGrid
      contentMain={
        <div className="space-y-6">
          <div className="space-y-4">
            <AdminTagsTable {...{ tags }} />
          </div>
        </div>}
    />
  );
}
