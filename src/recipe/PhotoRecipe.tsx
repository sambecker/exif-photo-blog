import { pathForRecipe } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import { formatRecipe } from '.';
import clsx from 'clsx/lite';
import { RefObject } from 'react';
import IconRecipe from '@/components/icons/IconRecipe';

export default function PhotoRecipe({
  recipe,
  countOnHover,
  refButton,
  isOpen,
  recipeOnClick,
  ...props
}: {
  recipe: string
  refButton?: RefObject<HTMLButtonElement | null>
  isOpen?: boolean
  recipeOnClick?: () => void
  countOnHover?: number
} & EntityLinkExternalProps) {
  return (
    <div className="flex w-full gap-2">
      <EntityLink
        {...props}
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
        hoverEntity={countOnHover}
      />
      {recipeOnClick &&
        <button
          ref={refButton}
          onClick={recipeOnClick}
          className={clsx(
            'self-start',
            'px-1 py-0.5',
            'text-[10px] text-main font-medium tracking-wider',
            'translate-y-[0.5px]',
          )}
        >
          {isOpen ? 'CLOSE' : 'RECIPE'}
        </button>}
    </div>
  );
}
