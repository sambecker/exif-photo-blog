'use client';

import LinkWithLoader from '@/components/LinkWithLoader';
import LinkWithStatus from '@/components/LinkWithStatus';
import Note from '@/components/Note';
import SiteGrid from '@/components/SiteGrid';
import Spinner from '@/components/Spinner';
import {
  PATH_ADMIN_CONFIGURATION,
  PATH_ADMIN_INSIGHTS,
  checkPathPrefix,
  isPathAdminConfiguration,
  isPathAdminInsights,
  isPathTopLevelAdmin,
} from '@/site/paths';
import { useAppState } from '@/state/AppState';
import { clsx } from 'clsx/lite';
import { differenceInMinutes } from 'date-fns';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaRegClock } from 'react-icons/fa';
import { FaInfo } from 'react-icons/fa';
import { HiOutlineCog } from 'react-icons/hi';

const DEBUG_INDICATOR_SIZE = true;

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
              'grow overflow-x-auto',
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
            <div className="flex gap-3">
              <span className="inline-flex relative">
                <LinkWithLoader
                  href={PATH_ADMIN_INSIGHTS}
                  className={isPathAdminInsights(pathname)
                    ? 'font-bold'
                    : 'text-dim'}
                  loader={<Spinner className="translate-y-[-1px]" />}
                >
                  <span className={clsx(
                    'size-[16px]',
                    'inline-flex items-center justify-center',
                    'border-[1.5px] border-current rounded-[6px]',
                    'translate-y-[3px]',
                  )}>
                    <FaInfo
                      size={8}
                      aria-label="App Configuration"
                    />
                  </span>
                </LinkWithLoader>
                {DEBUG_INDICATOR_SIZE && <span className={clsx(
                  'absolute top-[0.5px] right-[-2.5px] size-2 rounded-full',
                  'bg-blue-500',
                )} />}
              </span>
              <LinkWithLoader
                href={PATH_ADMIN_CONFIGURATION}
                className={isPathAdminConfiguration(pathname)
                  ? 'font-bold'
                  : 'text-dim'}
                loader={<Spinner className="translate-y-[-0.75px]" />}
              >
                <HiOutlineCog
                  size={20}
                  className="inline-flex translate-y-[1px]"
                  aria-label="App Configuration"
                />
              </LinkWithLoader>
            </div>
          </div>
          {shouldShowBanner &&
            <Note icon={<FaRegClock className="shrink-0" />}>
              Photo updates detected—they may take several minutes to show up
              for visitors
            </Note>}
        </div>
      }
    />
  );
}
