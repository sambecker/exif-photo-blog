'use client';

import SiteGrid from '@/components/SiteGrid';
import StatusIcon from '@/components/StatusIcon';
import clsx from 'clsx/lite';

export default function ComponentsPage() {
  return (
    <SiteGrid
      contentMain={<div className={clsx(
        'flex gap-0.5',
        '*:inline-flex *:bg-medium',
      )}>
        <StatusIcon type="checked" />
        <StatusIcon type="missing" />
        <StatusIcon type="warning" />
        <StatusIcon type="optional" />
      </div>}
    />
  );
}
