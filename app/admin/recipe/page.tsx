import { getPhotos } from '@/photo/db/query';
import PhotoRecipeOverlay from '@/photo/PhotoRecipeOverlay';

export default async function AdminRecipePage() {
  const photos = await getPhotos({ tag: 'favs', limit: 4});
  const photosHidden = await getPhotos({ hidden: 'only', limit: 1 });
  const { filmSimulation } = photosHidden[0];
  const { fujifilmRecipe } = photosHidden[0];
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 w-full">
      {photos.map(photo =>
        <PhotoRecipeOverlay
          key={photo.id}
          backgroundImageUrl={photo.url}
          recipe={fujifilmRecipe!}
          simulation={filmSimulation!}
          exposure={photo.exposureCompensationFormatted ?? '+0ev'}
          iso={photo.isoFormatted ?? 'ISO 0'}
        />,
      )}
      <PhotoRecipeOverlay
        key="black"
        className="bg-black"
        recipe={fujifilmRecipe!}
        simulation={filmSimulation!}
        exposure="+0ev"
        iso="ISO 0"
      />
      <PhotoRecipeOverlay
        key="white"
        className="bg-white"
        recipe={fujifilmRecipe!}
        simulation={filmSimulation!}
        exposure="+0ev"
        iso="ISO 0"
      />
    </div>);
}
