import { pathForTag } from '@/app/paths';
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
    <div className="flex w-full gap-2 h-[20.5px]">
      <EntityLink
        title="Recipe"
        label={formatRecipe(recipe)}
        href={pathForTag(recipe)}
        icon={<TbChecklist size={16} />}
        className={className}
        type={type}
        badged={badged}
        contrast={contrast}
        prefetch={prefetch}
        hoverEntity={countOnHover}
      />
      <button
        onClick={recipeOnClick}
        className={clsx(
          'px-1! py-0!',
          'text-[11px] text-medium tracking-wider',
        )}
      >
        OPEN
      </button>
    </div>
  );
}
