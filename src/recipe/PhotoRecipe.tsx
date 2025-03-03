import { pathForRecipe } from '@/app/paths';
import EntityLink, {
  EntityLinkExternalProps,
} from '@/components/primitives/EntityLink';
import { TbChecklist } from 'react-icons/tb';
import { formatRecipe } from '.';
import clsx from 'clsx';

export default function PhotoRecipe({
  recipe,
  type,
  badged,
  contrast,
  prefetch,
  countOnHover,
  className,
  recipeOnClick,
}: {
  recipe: string
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
          onClick={recipeOnClick}
          className={clsx(
            'self-start',
            'px-1 py-0.5',
            'text-[10px] text-medium tracking-wider',
          )}
        >
          RECIPE
        </button>}
    </div>
  );
}
