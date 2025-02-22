'use client';

import { labelForFilmSimulation } from '@/platforms/fujifilm/simulation';
import PhotoFilmSimulationIcon from './PhotoFilmSimulationIcon';
import { pathForFilmSimulation } from '@/app/paths';
import { FilmSimulation } from '.';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import { LuChevronsUpDown } from 'react-icons/lu';
import clsx from 'clsx/lite';
import { useState } from 'react';
import Tooltip from '@/components/Tooltip';
import PhotoRecipe from '@/photo/PhotoRecipe';

export default function PhotoFilmSimulation({
  simulation,
  type = 'icon-last',
  badged = true,
  contrast = 'low',
  prefetch,
  countOnHover,
  recipe,
  className,
}: {
  simulation: FilmSimulation
  countOnHover?: number
  recipe?: FujifilmRecipe
  className?: string
} & EntityLinkExternalProps) {
  const { small, medium, large } = labelForFilmSimulation(simulation);

  const [shouldShowRecipe, setShouldShowRecipe] = useState(false);

  return (
    <div className={clsx('space-y-baseline', className)}>
      <div className="flex items-center gap-2 *:w-auto">
        <EntityLink
          label={medium}
          labelSmall={small}
          href={pathForFilmSimulation(simulation)}
          icon={<PhotoFilmSimulationIcon simulation={simulation} />}
          title={`Film Simulation: ${large}`}
          type={type}
          badged={badged}
          contrast={contrast}
          prefetch={prefetch}
          hoverEntity={countOnHover}
          iconWide
        />
        {recipe &&
          <Tooltip content="Fujifilm Recipe">
            <button
              onClick={() => setShouldShowRecipe(!shouldShowRecipe)}
              className={clsx(
                'text-medium',
                'border-medium rounded-md',
                'px-[4px] py-[2.5px] my-[-2.5px]',
                'hover:bg-dim active:bg-main',
              )}>
              <LuChevronsUpDown size={15} />
            </button>
          </Tooltip>} 
      </div>
      {recipe && shouldShowRecipe &&
        <PhotoRecipe {...{ recipe, simulation }} />}
    </div>
  );
}
