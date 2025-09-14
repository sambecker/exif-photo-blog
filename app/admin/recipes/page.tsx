import AdminRecipeTable from '@/admin/AdminRecipeTable';
import AppGrid from '@/components/AppGrid';
import { getUniqueRecipes } from '@/photo/query';

export default async function AdminRecipesPage() {
  const recipes = await getUniqueRecipes().catch(() => []);

  return (
    <AppGrid
      contentMain={
        <div className="space-y-6">
          <div className="space-y-4">
            <AdminRecipeTable {...{ recipes }} />
          </div>
        </div>}
    />
  );
}
