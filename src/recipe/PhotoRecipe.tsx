import { pathForRecipe } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import { TbChecklist } from 'react-icons/tb';
import { formatRecipe } from '.';
import clsx from 'clsx/lite';
import { RefObject } from 'react';

export default function PhotoRecipe({
  recipe,
  type,
  badged,
  contrast,
  prefetch,
  countOnHover,
  className,
  refButton,
  isOpen,
  recipeOnClick,
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
        title="Recipe"
        label={formatRecipe(recipe)}
        href={pathForRecipe(recipe)}
        icon={<TbChecklist
          size={16}
          className={clsx(
            badged && 'translate-x-[-1px] translate-y-[0.5px]',
          )}
        />}
        className={className}
        type={type}
        badged={badged}
        contrast={contrast}
        prefetch={prefetch}
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
