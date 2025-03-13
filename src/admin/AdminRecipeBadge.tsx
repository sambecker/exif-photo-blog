import { photoLabelForCount } from '@/photo';
import { clsx } from 'clsx/lite';
import Badge from '@/components/Badge';
import PhotoRecipe from '@/recipe/PhotoRecipe';

export default function AdminRecipeBadge({
  recipe,
  count,
  hideBadge,
}: {
  recipe: string,
  count: number,
  hideBadge?: boolean,
}) {
  const renderBadgeContent = () =>
    <div className={clsx(
      'inline-flex items-center gap-2',
      'translate-y-[1.5px]',
    )}>
      <PhotoRecipe {...{ recipe }} />
      <div className="text-dim uppercase">
        <span>{count}</span>
        <span className="hidden xs:inline-block">
          &nbsp;
          {photoLabelForCount(count)}
        </span>
      </div>
    </div>;

  return (
    hideBadge
      ? renderBadgeContent()
      : <Badge className="py-[3px]!">{renderBadgeContent()}</Badge>
  );
}