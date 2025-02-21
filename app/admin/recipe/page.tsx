import SiteGrid from '@/components/SiteGrid';
import { getPhotos } from '@/photo/db/query';
import PhotoRecipeOverlay from '@/photo/PhotoRecipeOverlay';

export default async function AdminRecipePage() {
  const photos = await getPhotos({ limit: 1});
  const photosHidden = await getPhotos({ hidden: 'only' });
  const { fujifilmRecipe, filmSimulation } = photosHidden[0];
  return (
    <SiteGrid
      contentMain={photos[0] && fujifilmRecipe && filmSimulation
        ? <PhotoRecipeOverlay
          backgroundImageUrl={photos[0].url}
          recipe={fujifilmRecipe}
          simulation={filmSimulation}
        />
        : <div>
          Can&apos;t find photo/recipe
        </div>}
    />
  );
}
