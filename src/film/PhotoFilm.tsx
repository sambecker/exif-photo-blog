'use client';

import PhotoFilmIcon from './PhotoFilmIcon';
import { pathForFilm } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';
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
  toggleRecipeOverlay,
  isShowingRecipeOverlay,
  ...props
}: {
  film: string
} & Partial<ComponentProps<typeof PhotoRecipeOverlayButton>>
  & EntityLinkExternalProps) {
  const { small, medium, large } = labelForFilm(film);

  return (
    <EntityLink
      {...props}
      label={medium}
      labelSmall={small}
      path={pathForFilm(film)}
      hoverPhotoQueryOptions={{ film }}
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
      iconWide={isStringFujifilmSimulation(film)}
    />
  );
}
