import AdminPage from '@/admin/AdminPage';
import AdminRecipeTable from '@/admin/AdminRecipeTable';
import { getAppText } from '@/i18n/state/server';
import { getUniqueRecipes } from '@/photo/query';
import { pluralize } from '@/utility/string';

export default async function AdminRecipesPage() {
  const recipes = await getUniqueRecipes().catch(() => []);
  
  const appText = await getAppText();

  return (
    <AdminPage
      title={pluralize(
        recipes.length,
        appText.category.recipe,
        appText.category.recipePlural,
      )}
    >
      <AdminRecipeTable {...{ recipes }} />
    </AdminPage>
  );
}
