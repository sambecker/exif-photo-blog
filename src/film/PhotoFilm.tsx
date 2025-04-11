import PhotoFilmIcon from './PhotoFilmIcon';
import { pathForFilm } from '@/app/paths';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import clsx from 'clsx/lite';
import { labelForFilm } from '.';
import { isStringFujifilmSimulation } from '@/platforms/fujifilm/simulation';
import PhotoRecipeOverlayButton from '@/recipe/PhotoRecipeOverlayButton';
import { ComponentProps } from 'react';

export default function PhotoFilm({
  film,
  type = 'icon-last',
  badged = true,
  contrast = 'low',
  countOnHover,
  toggleRecipeOverlay,
  isShowingRecipeOverlay,
  ...props
}: {
  film: string
  countOnHover?: number
  recipe?: FujifilmRecipe
} & Partial<ComponentProps<typeof PhotoRecipeOverlayButton>>
  & EntityLinkExternalProps) {
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
      action={toggleRecipeOverlay &&
        <PhotoRecipeOverlayButton {...{
          toggleRecipeOverlay,
          isShowingRecipeOverlay,
        }} />}
      hoverEntity={countOnHover}
      iconWide={isStringFujifilmSimulation(film)}
    />
  );
}
