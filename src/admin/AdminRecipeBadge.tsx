import { photoLabelForCount } from '@/photo';
import { clsx } from 'clsx/lite';
import Badge from '@/components/Badge';
import PhotoRecipe from '@/recipe/PhotoRecipe';
import { getAppText } from '@/i18n/state/server';

export default async function AdminRecipeBadge({
  recipe,
  count,
  hideBadge,
}: {
  recipe: string,
  count: number,
  hideBadge?: boolean,
}) {
  const appText = await getAppText();

  const renderBadgeContent = () =>
    <div className={clsx(
      'inline-flex items-center gap-2',
    )}>
      <PhotoRecipe {...{ recipe }} />
      <div className="text-dim uppercase">
        <span>{count}</span>
        <span className="hidden xs:inline-block">
          &nbsp;
          {photoLabelForCount(count, appText)}
        </span>
      </div>
    </div>;

  return (
    hideBadge
      ? renderBadgeContent()
      : <Badge className="py-[3px]!">{renderBadgeContent()}</Badge>
  );
}
