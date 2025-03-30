import { labelForFilm } from '@/platforms/fujifilm/simulation';
import PhotoFilmIcon from './PhotoFilmIcon';
import { pathForFilm } from '@/app/paths';
import { FilmSimulation } from '.';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import clsx from 'clsx/lite';

export default function PhotoFilm({
  film,
  type = 'icon-last',
  badged = true,
  contrast = 'low',
  countOnHover,
  ...props
}: {
  film: FilmSimulation
  countOnHover?: number
  recipe?: FujifilmRecipe
} & EntityLinkExternalProps) {
  const { small, medium, large } = labelForFilm(film);

  return (
    <EntityLink
      {...props}
      label={medium}
      labelSmall={small}
      href={pathForFilm(film)}
      icon={<PhotoFilmIcon
        film={film}
        className={clsx(
          contrast === 'frosted' && 'text-black',
          type === 'icon-only'
            ? 'translate-y-[-2.5px]'
            : 'translate-y-[-1px]',
        )}
      />}
      title={`Film: ${large}`}
      type={type}
      badged={badged}
      contrast={contrast}
      hoverEntity={countOnHover}
      iconWide
    />
  );
}
