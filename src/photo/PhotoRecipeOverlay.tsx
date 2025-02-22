import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/simulation';
import clsx from 'clsx/lite';
import ImageLarge from '@/components/image/ImageLarge';
import PhotoRecipeFrostLightV2 from './PhotoRecipeFrostLightV2';

export default function PhotoRecipeOverlay({
  backgroundImageUrl,
  recipe,
  simulation,
  exposure,
  iso,
}: {
  backgroundImageUrl: string
  recipe: FujifilmRecipe
  simulation: FilmSimulation
  exposure: string
  iso: string
}) {
  return (
    <div className="space-y-4">
      <div className={clsx(
        'relative w-full aspect-[3/2]',
      )}>
        <ImageLarge
          src={backgroundImageUrl}
          alt="Image Background"
          aspectRatio={3 / 2}
        />
        <div className={clsx(
          'absolute inset-0',
          'flex items-center justify-center',
        )}>
          <PhotoRecipeFrostLightV2 {...{
            recipe,
            simulation,
            exposure,
            iso,
          }} />
        </div>
      </div>
    </div>
  );
}
