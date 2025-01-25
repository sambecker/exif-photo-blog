'use client';

import LinkWithLoader from '@/components/LinkWithLoader';
import LinkWithStatus from '@/components/LinkWithStatus';
import Note from '@/components/Note';
import SiteGrid from '@/components/SiteGrid';
import Spinner from '@/components/Spinner';
import {
  PATH_ADMIN_CONFIGURATION,
  checkPathPrefix,
  isPathAdminConfiguration,
  isPathTopLevelAdmin,
} from '@/site/paths';
import { useAppState } from '@/state/AppState';
import { clsx } from 'clsx/lite';
import { differenceInMinutes } from 'date-fns';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { BiCog } from 'react-icons/bi';
import { FaRegClock } from 'react-icons/fa';

// Updates considered recent if they occurred in past 5 minutes
const areTimesRecent = (dates: Date[]) => dates
  .some(date => differenceInMinutes(new Date(), date) < 5);

export default function AdminNavClient({
  items,
  mostRecentPhotoUpdateTime,
}: {
  items: {
    label: string,
    href: string,
    count: number,
  }[]
  mostRecentPhotoUpdateTime?: Date
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
    <SiteGrid
      contentMain={
        <div className="space-y-5">
          <div className={clsx(
            'flex gap-2 pb-3',
            'border-b border-gray-200 dark:border-gray-800',
          )}>
            <div className={clsx(
              'flex gap-0.5 md:gap-1.5 -mx-1',
              'flex-grow overflow-x-auto',
            )}>
              {items.map(({ label, href, count }) =>
                <LinkWithStatus
                  key={label}
                  href={href}
                  className={clsx(
                    'flex gap-0.5',
                    checkPathPrefix(pathname, href) ? 'font-bold' : 'text-dim',
                    'px-1 py-0.5 rounded-md',
                  )}
                  loadingClassName="bg-dim"
                  prefetch={false}
                >
                  <span>{label}</span>
                  {count > 0 &&
                    <span>({count})</span>}
                </LinkWithStatus>)}
            </div>
            <LinkWithLoader
              href={PATH_ADMIN_CONFIGURATION}
              className={isPathAdminConfiguration(pathname)
                ? 'font-bold'
                : 'text-dim'}
              loader={<Spinner />}
            >
              <BiCog
                size={18}
                className="inline-flex translate-y-0.5"
                aria-label="App Configuration"
              />
            </LinkWithLoader>
          </div>
          {shouldShowBanner &&
            <Note icon={<FaRegClock className="flex-shrink-0" />}>
              Photo updates detected—they may take several minutes to show up
              for visitors
            </Note>}
        </div>
      }
    />
  );
}
