import { ReactNode } from 'react';
import { clsx } from 'clsx/lite';
import { pluralize } from '@/utility/string';

export default function AdminPageHeader({
  count,
  singular,
  plural,
  accessory,
  className,
}: {
  count: number
  singular: string
  plural: string
  accessory?: ReactNode
  className?: string
}) {
  return (
    <div className={clsx(
      // Match button height so headers align with or without accessory
      'flex items-center gap-4 min-h-9.5',
      className,
    )}>
      <div className="grow shrink-0 font-bold">
        {pluralize(count, singular, plural)}
      </div>
      {accessory &&
        <div className="flex items-center justify-end gap-2 min-w-0">
          {accessory}
        </div>}
    </div>
  );
}
