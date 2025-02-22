import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/simulation';
import clsx from 'clsx/lite';
import ImageLarge from '@/components/image/ImageLarge';
import PhotoRecipe from './PhotoRecipe';

export default function PhotoRecipeOverlay({
  backgroundImageUrl,
  recipe,
  simulation,
  exposure,
  iso,
  className,
}: {
  backgroundImageUrl?: string
  recipe: FujifilmRecipe
  simulation: FilmSimulation
  exposure: string
  iso: string
  className?: string
}) {
  return (
    <div className={clsx(
      'relative w-full aspect-[3/2]',
      className,
    )}>
      {backgroundImageUrl &&<ImageLarge
        src={backgroundImageUrl}
        alt="Image Background"
        aspectRatio={3 / 2}
      />}
      <div className={clsx(
        'absolute inset-0',
        'flex items-center justify-center',
      )}>
        <PhotoRecipe {...{
          recipe,
          simulation,
          exposure,
          iso,
        }} />
      </div>
    </div>
  );
}
