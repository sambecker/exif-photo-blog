import AdminPageHeader from '@/admin/AdminPageHeader';
import AdminRecipeTable from '@/admin/AdminRecipeTable';
import AppGrid from '@/components/AppGrid';
import { getAppText } from '@/i18n/state/server';
import { getUniqueRecipes } from '@/photo/query';

export default async function AdminRecipesPage() {
  const recipes = await getUniqueRecipes().catch(() => []);
  
  const appText = await getAppText();

  return (
    <AppGrid
      contentMain={
        <div className="space-y-6">
          <div className="space-y-4">
            <AdminPageHeader
              count={recipes.length}
              singular={appText.category.recipe}
              plural={appText.category.recipePlural}
            />
            <AdminRecipeTable {...{ recipes }} />
          </div>
        </div>}
    />
  );
}
