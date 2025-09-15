import { photoLabelForCount } from '@/photo';
import { clsx } from 'clsx/lite';
import Badge from '@/components/Badge';
import { getAppText } from '@/i18n/state/server';
import { ReactNode } from 'react';

export default async function AdminBadge({
  entity,
  count,
  hideBadge,
  className,
}: {
  entity: ReactNode,
  count: number,
  hideBadge?: boolean,
  className?: string,
}) {
  const appText = await getAppText();

  const renderBadgeContent = () =>
    <div className={clsx(
      'inline-flex items-center gap-2',
      // Fix nested EntityLink-in-Badge quirk
      '[&>*>*:first-child]:items-center',
      className,
    )}>
      {entity}
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