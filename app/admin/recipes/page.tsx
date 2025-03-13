import AdminRecipeTable from '@/admin/AdminRecipeTable';
import SiteGrid from '@/components/SiteGrid';
import { getUniqueRecipes } from '@/photo/db/query';

export default async function AdminRecipesPage() {
  const recipes = await getUniqueRecipes().catch(() => []);

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
