'use client';

import { pathForRecipe, pathForRecipeImage } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import { formatRecipe } from '.';
import clsx from 'clsx/lite';
import { ComponentProps } from 'react';
import IconRecipe from '@/components/icons/IconRecipe';
import PhotoRecipeOverlayButton from './PhotoRecipeOverlayButton';
import { useAppText } from '@/i18n/state/client';
import { photoQuantityText } from '@/photo';

export default function PhotoRecipe({
  ref,
  recipe,
  countOnHover,
  toggleRecipeOverlay,
  isShowingRecipeOverlay,
  ...props
}: {
  recipe: string
  countOnHover?: number
} & Partial<ComponentProps<typeof PhotoRecipeOverlayButton>>
  & EntityLinkExternalProps) {
  const appText = useAppText();

  return (
    <EntityLink
      {...props}
      ref={ref}
      title="Recipe"
      label={formatRecipe(recipe)}
      path={pathForRecipe(recipe)}
      tooltipImagePath={pathForRecipeImage(recipe)}
      tooltipCaption={countOnHover &&
        photoQuantityText(countOnHover, appText, false)}
      icon={<IconRecipe
        size={16}
        className={clsx(
          props.badged && 'translate-x-[-1px] translate-y-[0.5px]',
        )}
      />}
      action={toggleRecipeOverlay &&
        <PhotoRecipeOverlayButton {...{
          toggleRecipeOverlay,
          isShowingRecipeOverlay,
        }} />}
      hoverEntity={countOnHover}
    />
  );
}
