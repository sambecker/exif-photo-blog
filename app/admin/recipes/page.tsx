import AdminRecipeTable from '@/admin/AdminRecipeTable';
import SiteGrid from '@/components/SiteGrid';
import { getUniqueRecipesCached } from '@/photo/cache';

export default async function AdminTagsPage() {
  const recipes = await getUniqueRecipesCached().catch(() => []);

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-6">
          <div className="space-y-4">
            <AdminRecipeTable {...{ recipes }} />
          </div>
        </div>}
    />
  );
}
