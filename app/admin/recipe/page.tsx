import { getPhoto, getPhotos } from '@/photo/db/query';
import PhotoRecipeOverlay from '@/photo/PhotoRecipeOverlay';

export default async function AdminRecipePage() {
  const [
    photos,
    photo1,
    photo2,
    photo3,
    photo4,
    photosHidden,
  ] = await Promise.all([
    getPhotos({ tag: 'favs' }),
    getPhoto('4zT6dgPr'),
    getPhoto('9MopluBn'),
    getPhoto('ifv8zq45'),
    getPhoto('2BO2YoW6'),
    getPhotos({ hidden: 'only', limit: 1 }),
  ]);
  const { fujifilmRecipe } = photosHidden[0];
  return (
    <PhotoRecipeOverlay
      photos={[
        ...photos,
        photo1!,
        photo2!,
        photo3!,
        photo4!,
      ]}
      recipe={fujifilmRecipe!}
    />
  );
}
