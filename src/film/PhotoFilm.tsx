'use client';

import PhotoFilmIcon from './PhotoFilmIcon';
import { pathForFilm, pathForFilmImage } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import clsx from 'clsx/lite';
import { labelForFilm } from '.';
import { isStringFujifilmSimulation } from '@/platforms/fujifilm/simulation';
import PhotoRecipeOverlayButton from '@/recipe/PhotoRecipeOverlayButton';
import { ComponentProps } from 'react';
import { useAppText } from '@/i18n/state/client';
import { photoQuantityText } from '@/photo';

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
} & Partial<ComponentProps<typeof PhotoRecipeOverlayButton>>
  & EntityLinkExternalProps) {
  const appText = useAppText();
  const { small, medium, large } = labelForFilm(film);

  return (
    <EntityLink
      {...props}
      label={medium}
      labelSmall={small}
      path={pathForFilm(film)}
      tooltipImagePath={pathForFilmImage(film)}
      tooltipCaption={countOnHover &&
        photoQuantityText(countOnHover, appText, false)}
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
