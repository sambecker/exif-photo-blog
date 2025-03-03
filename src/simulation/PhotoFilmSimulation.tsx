import { labelForFilmSimulation } from '@/platforms/fujifilm/simulation';
import PhotoFilmSimulationIcon from './PhotoFilmSimulationIcon';
import { pathForFilmSimulation } from '@/app/paths';
import { FilmSimulation } from '.';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import clsx from 'clsx/lite';

export default function PhotoFilmSimulation({
  simulation,
  type = 'icon-last',
  badged = true,
  contrast = 'low',
  prefetch,
  countOnHover,
  className,
}: {
  simulation: FilmSimulation
  countOnHover?: number
  recipe?: FujifilmRecipe
} & EntityLinkExternalProps) {
  const { small, medium, large } = labelForFilmSimulation(simulation);

  return (
    <EntityLink
      label={medium}
      labelSmall={small}
      href={pathForFilmSimulation(simulation)}
      icon={<PhotoFilmSimulationIcon
        simulation={simulation}
        className={clsx(contrast === 'frosted' && 'text-black')}
      />}
      title={`Film Simulation: ${large}`}
      type={type}
      className={className}
      badged={badged}
      contrast={contrast}
      prefetch={prefetch}
      hoverEntity={countOnHover}
      iconWide
    />
  );
}
