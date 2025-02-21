'use client';

import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/simulation';
import clsx from 'clsx/lite';
import ImageLarge from '@/components/image/ImageLarge';
import PhotoRecipeFrost from './PhotoRecipeFrost';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import { useState } from 'react';
import PhotoRecipe from './PhotoRecipe';
export default function PhotoRecipeOverlay({
  backgroundImageUrl,
  recipe,
  simulation,
}: {
  backgroundImageUrl: string
  recipe: FujifilmRecipe
  simulation: FilmSimulation
}) {
  const [isFrosted, setIsFrosted] = useState(true);

  return (
    <div className="space-y-4">
      <div>
        <FieldSetWithStatus
          id="is-frosted"
          type="checkbox"
          label="Frosted"
          value={isFrosted ? 'true' : 'false'}
          onChange={() => setIsFrosted(!isFrosted)}
        />
      </div>
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
          {isFrosted
            ? <PhotoRecipeFrost
              recipe={recipe}
              simulation={simulation}
            /> : <PhotoRecipe
              recipe={recipe}
              simulation={simulation}
            />}
        </div>
      </div>
    </div>
  );
}
