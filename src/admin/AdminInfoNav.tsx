'use client';

import { PATH_ADMIN_CONFIGURATION, PATH_ADMIN_INSIGHTS } from '@/app/paths';
import LinkWithStatus from '@/components/LinkWithStatus';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import clsx from 'clsx/lite';
import ClearCacheButton from '@/admin/ClearCacheButton';
import { usePathname } from 'next/navigation';

const ADMIN_INFO_PAGES = [{
  titleShort: 'Insights',
  path: PATH_ADMIN_INSIGHTS,
}, {
  title: 'Configuration',
  titleShort: 'Config',
  path: PATH_ADMIN_CONFIGURATION,
}];

export default function AdminInfoPage({
  includeInsights,
}: {
  includeInsights: boolean
}) {
  const pathname = usePathname();

  const pages = ADMIN_INFO_PAGES
    .filter(({ titleShort }) => (
      titleShort !== 'Insights' ||
      includeInsights
    ));

  const hasMultiplePages = pages.length > 1;

  return (
    <div className="flex items-center gap-4 min-h-9">
      <div className={clsx(
        'grow -translate-x-1',
        'flex items-center gap-3',
        hasMultiplePages && '-translate-y-1',
      )}>
        {pages
          .map(({ title, titleShort, path }) =>
            <LinkWithStatus
              key={path}
              href={path}
              className={clsx(
                hasMultiplePages
                  ? pathname === path
                    ? 'underline underline-offset-10 decoration-2'
                    : 'text-dim'
                  : undefined,
                'px-1 py-0.5 rounded-md',
              )}
              loadingClassName="bg-dim"
            >
              <ResponsiveText shortText={titleShort}>
                {title ?? titleShort}
              </ResponsiveText>
            </LinkWithStatus>)}
      </div>
      <ClearCacheButton />
    </div>
  );
}
