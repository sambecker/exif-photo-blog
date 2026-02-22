'use client';

import AppGrid from '@/components/AppGrid';
import clsx from 'clsx/lite';
import { formatDistanceToNowStrict } from 'date-fns';

export default function AboutPageClient({
  lastUpdated,
}: {
  lastUpdated?: Date
}) {
  return (
    <AppGrid contentMain={<div className={clsx(
      'space-y-8 mt-5',
    )}>
      <div className={clsx('sm:flex items-center justify-between')}>
        <div>About this site</div>
        {lastUpdated && <div className={clsx('text-dim')}>
          Last updated {formatDistanceToNowStrict(
            lastUpdated,
            { addSuffix: true },
          )}
        </div>}
      </div>
      <div className={clsx('text-medium')}>
        {/* eslint-disable-next-line max-len */}
        A digital gallery dedicated to the beauty of the mundane. This blog explores the intersection of light, shadow, and silence. No filters, no noise—just the world as it sits when we stop to look.
      </div>
    </div>} />
  );
}
