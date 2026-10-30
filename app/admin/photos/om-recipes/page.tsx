import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { getPendingOmRecipes } from '@/platforms/om-system/query';
import OmRecipeImport from '@/platforms/om-system/OmRecipeImport';

export const maxDuration = 60;

export default async function OmRecipesPage() {
  const photos = await runAuthenticatedAdminServerAction(getPendingOmRecipes);
  return <OmRecipeImport photos={photos} />;
}
