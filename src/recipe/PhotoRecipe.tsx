import { pathForRecipe } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import { formatRecipe } from '.';
import clsx from 'clsx/lite';
import { ComponentProps } from 'react';
import IconRecipe from '@/components/icons/IconRecipe';
import PhotoRecipeOverlayButton from './PhotoRecipeOverlayButton';

export default function PhotoRecipe({
  ref,
  recipe,
  countOnHover,
  toggleRecipeOverlay,
  shouldShowRecipeOverlay,
  ...props
}: {
  recipe: string
  countOnHover?: number
} & Partial<ComponentProps<typeof PhotoRecipeOverlayButton>>
  & EntityLinkExternalProps) {
  return (
    <EntityLink
      {...props}
      ref={ref}
      title="Recipe"
      label={formatRecipe(recipe)}
      href={pathForRecipe(recipe)}
      icon={<IconRecipe
        size={16}
        className={clsx(
          props.badged
            ? 'translate-x-[-1px] translate-y-[0.5px]'
            : 'translate-y-[-0.5px]',
        )}
      />}
      accessory={toggleRecipeOverlay &&
        <PhotoRecipeOverlayButton {...{
          toggleRecipeOverlay,
          shouldShowRecipeOverlay,
        }} />}
      hoverEntity={countOnHover}
    />
  );
}
