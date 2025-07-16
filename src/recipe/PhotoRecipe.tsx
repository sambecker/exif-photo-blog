'use client';

import { pathForRecipe } from '@/app/path';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/entity/EntityLink';
import { formatRecipe } from '.';
import clsx from 'clsx/lite';
import { ComponentProps } from 'react';
import IconRecipe from '@/components/icons/IconRecipe';
import PhotoRecipeOverlayButton from './PhotoRecipeOverlayButton';

export default function PhotoRecipe({
  ref,
  recipe,
  toggleRecipeOverlay,
  isShowingRecipeOverlay,
  ...props
}: {
  recipe: string
} & Partial<ComponentProps<typeof PhotoRecipeOverlayButton>>
  & EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      ref={ref}
      title="Recipe"
      label={formatRecipe(recipe)}
      path={pathForRecipe(recipe)}
      hoverPhotoQueryOptions={{ recipe }}
      icon={<IconRecipe
        size={16}
        className={clsx(
          props.badged && 'translate-x-[-1px] translate-y-[-1px]',
        )}
      />}
      action={toggleRecipeOverlay &&
        <PhotoRecipeOverlayButton {...{
          toggleRecipeOverlay,
          isShowingRecipeOverlay,
        }} />}
    />
  );
}
