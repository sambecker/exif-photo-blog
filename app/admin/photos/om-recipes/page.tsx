import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { getPendingPenRecipes } from '@/platforms/om-system/query';
import PenRecipeImport from '@/platforms/om-system/PenRecipeImport';

export const maxDuration = 60;

export default async function PenRecipesPage() {
  const photos = await runAuthenticatedAdminServerAction(getPendingPenRecipes);
  return <PenRecipeImport photos={photos} />;
}
