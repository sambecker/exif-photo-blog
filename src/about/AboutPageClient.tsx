'use client';

import AppGrid from '@/components/AppGrid';
import clsx from 'clsx/lite';

export default function AboutPageClient() {
  return (
    <AppGrid contentMain={<div className={clsx(
      'space-y-8 mt-5',
    )}>
      <div>About this site</div>
      <div className={clsx('text-medium')}>
        {/* eslint-disable-next-line max-len */}
        A digital gallery dedicated to the beauty of the mundane. This blog explores the intersection of light, shadow, and silence. No filters, no noise—just the world as it sits when we stop to look.
      </div>
    </div>} />
  );
}
