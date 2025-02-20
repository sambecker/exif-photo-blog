import SiteGrid from '@/components/SiteGrid';
import { getPhotos } from '@/photo/db/query';
import PhotoRecipe from '@/photo/PhotoRecipe';
import clsx from 'clsx/lite';

export default async function AdminRecipePage() {
  const photos = await getPhotos({ hidden: 'only' });
  const { fujifilmRecipe } = photos[0];
  return (
    <SiteGrid
      contentMain={<div className={clsx(
        'w-full min-h-[600px]',
        'flex items-center justify-center',
      )}>
        {fujifilmRecipe &&
          <PhotoRecipe recipe={fujifilmRecipe} />
        }
      </div>}
    />
  );
}

