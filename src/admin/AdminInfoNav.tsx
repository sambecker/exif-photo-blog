'use client';

import { PATH_ADMIN_CONFIGURATION, PATH_ADMIN_INSIGHTS } from '@/app/paths';
import LinkWithStatus from '@/components/LinkWithStatus';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import clsx from 'clsx/lite';
import ClearCacheButton from '@/admin/ClearCacheButton';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/state/AppState';
import InsightsIndicatorDot from './insights/InsightsIndicatorDot';

const ADMIN_INFO_PAGES = [{
  title: 'App Insights',
  titleShort: 'Insights',
  path: PATH_ADMIN_INSIGHTS,
}, {
  title: 'Configuration',
  titleShort: 'Config',
  path: PATH_ADMIN_CONFIGURATION,
}];

const ADMIN_INFO_PAGE_WITHOUT_INSIGHTS = [{
  title: 'App Configuration',
  path: PATH_ADMIN_CONFIGURATION,
}] as typeof ADMIN_INFO_PAGES;

export default function AdminInfoPage({
  includeInsights,
}: {
  includeInsights: boolean
}) {
  const pathname = usePathname();

  const pages = includeInsights
    ? ADMIN_INFO_PAGES
    : ADMIN_INFO_PAGE_WITHOUT_INSIGHTS;

  const hasMultiplePages = pages.length > 1;

  const { insightIndicatorStatus } = useAppState();

  return (
    <div className="flex items-center gap-4 min-h-9">
      <div className={clsx(
        'grow -translate-x-1',
        'flex items-center gap-3',
      )}>
        {pages
          .map(({ title, titleShort, path }) =>
            <LinkWithStatus
              key={path}
              href={path}
              className={clsx(
                'relative',
                hasMultiplePages
                  ? pathname === path
                    ? 'font-medium'
                    : 'text-dim'
                  : undefined,
                'px-1 py-0.5 rounded-md',
                'hover:text-main',
              )}
              loadingClassName="bg-gray-200/50 dark:bg-gray-700/50"
            >
              <ResponsiveText shortText={titleShort}>
                {title}
              </ResponsiveText>
              {title === 'App Insights' && insightIndicatorStatus &&
                <InsightsIndicatorDot
                  size="small"
                  top={4}
                  right={-2}
                />}
            </LinkWithStatus>)}
      </div>
      <ClearCacheButton />
    </div>
  );
}
