'use client';

import LinkWithIconLoader from '@/components/LinkWithIconLoader';
import Note from '@/components/Note';
import AppGrid from '@/components/AppGrid';
import Spinner from '@/components/Spinner';
import {
  PATH_ADMIN_CONFIGURATION,
  PATH_ADMIN_INSIGHTS,
  checkPathPrefix,
  isPathAdminInfo,
  isPathTopLevelAdmin,
} from '@/app/paths';
import { useAppState } from '@/state/AppState';
import { clsx } from 'clsx/lite';
import { differenceInMinutes } from 'date-fns';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaRegClock } from 'react-icons/fa';
import AdminAppInfoIcon from './AdminAppInfoIcon';
import AdminInfoNav from './AdminInfoNav';
import LinkWithLoaderBadge from '@/components/LinkWithLoaderBadge';
import FadedScroll from '@/components/FadedScroll';

// Updates from past 5 minutes considered recent
const areTimesRecent = (dates: Date[]) => dates
  .some(date => differenceInMinutes(new Date(), date) < 5);

export default function AdminNavClient({
  items,
  mostRecentPhotoUpdateTime,
  includeInsights = true,
}: {
  items: {
    label: string,
    href: string,
    count: number,
  }[]
  mostRecentPhotoUpdateTime?: Date
  includeInsights?: boolean
}) {
  const pathname = usePathname();

  const { adminUpdateTimes = [] } = useAppState();

  const updateTimes = useMemo(() =>
    (mostRecentPhotoUpdateTime ? [mostRecentPhotoUpdateTime] : [])
      .concat(adminUpdateTimes)
  , [mostRecentPhotoUpdateTime, adminUpdateTimes]);

  const [hasRecentUpdates, setHasRecentUpdates] =
    useState(areTimesRecent(updateTimes));

  useEffect(() => {
    // Check every 5 seconds if update times are recent
    setHasRecentUpdates(areTimesRecent(updateTimes));
    const interval = setInterval(() =>
      setHasRecentUpdates(areTimesRecent(updateTimes))
    , 5_000);
    return () => clearInterval(interval);
  }, [updateTimes]);

  const shouldShowBanner = hasRecentUpdates && isPathTopLevelAdmin(pathname);

  return (
    <AppGrid
      contentMain={
        <div className="space-y-4">
          <div className={clsx(
            'flex gap-2 pb-3',
            'border-b border-gray-200 dark:border-gray-800',
          )}>
            <FadedScroll
              className="grow -mx-1"
              classNameContent="flex gap-0.5 md:gap-1.5"
              direction="horizontal"
            >
              {items.map(({ label, href, count }) =>
                <LinkWithLoaderBadge
                  key={label}
                  href={href}
                  className={clsx(
                    'flex gap-0.5',
                    checkPathPrefix(pathname, href) ? 'font-bold' : 'text-dim',
                    'hover:text-main',
                  )}
                  prefetch={false}
                >
                  <span>{label}</span>
                  {count > 0 &&
                    <span>({count})</span>}
                </LinkWithLoaderBadge>)}
            </FadedScroll>
            <LinkWithIconLoader
              href={includeInsights
                ? PATH_ADMIN_INSIGHTS
                : PATH_ADMIN_CONFIGURATION}
              className={isPathAdminInfo(pathname)
                ? 'font-bold'
                : 'text-dim'}
              icon={<AdminAppInfoIcon />}
              loader={<Spinner className="translate-y-[-0.75px]" />}
            />
          </div>
          {shouldShowBanner &&
            <Note icon={<FaRegClock className="shrink-0" />}>
              Photo updates detected—they may take several minutes to show up
              for visitors
            </Note>}
          {isPathAdminInfo(pathname) &&
            <AdminInfoNav {...{ includeInsights }} />}
        </div>
      }
    />
  );
}
