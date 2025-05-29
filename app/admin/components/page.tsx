'use client';

import AppGrid from '@/components/AppGrid';
import StatusIcon from '@/components/StatusIcon';
import clsx from 'clsx/lite';

export default function ComponentsPage() {
  return (
    <AppGrid
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
