import { labelForFilmSimulation } from '@/platforms/fujifilm/simulation';
import PhotoFilmIcon from './PhotoFilmIcon';
import { pathForFilmSimulation } from '@/app/paths';
import { FilmSimulation } from '.';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import clsx from 'clsx/lite';

export default function PhotoFilm({
  simulation,
  type = 'icon-last',
  badged = true,
  contrast = 'low',
  countOnHover,
  ...props
}: {
  simulation: FilmSimulation
  countOnHover?: number
  recipe?: FujifilmRecipe
} & EntityLinkExternalProps) {
  const { small, medium, large } = labelForFilmSimulation(simulation);

  return (
    <EntityLink
      {...props}
      label={medium}
      labelSmall={small}
      href={pathForFilmSimulation(simulation)}
      icon={<PhotoFilmIcon
        simulation={simulation}
        className={clsx(
          contrast === 'frosted' && 'text-black',
          type === 'icon-only'
            ? 'translate-y-[-2.5px]'
            : 'translate-y-[-1px]',
        )}
      />}
      title={`Film Simulation: ${large}`}
      type={type}
      badged={badged}
      contrast={contrast}
      hoverEntity={countOnHover}
      iconWide
    />
  );
}
