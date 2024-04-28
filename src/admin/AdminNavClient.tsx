'use client';

import InfoBlock from '@/components/InfoBlock';
import SiteGrid from '@/components/SiteGrid';
import {
  PATH_ADMIN_CONFIGURATION,
  checkPathPrefix,
  isPathAdminConfiguration,
  isPathTopLevelAdmin,
} from '@/site/paths';
import { useAppState } from '@/state/AppState';
import { clsx } from 'clsx/lite';
import { differenceInMinutes } from 'date-fns';
import Link from 'next/link';
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
            'flex gap-2 md:gap-4',
            'border-b border-gray-200 dark:border-gray-800 pb-3',
          )}>
            <div className={clsx(
              'flex gap-2 md:gap-4',
              'flex-grow overflow-x-auto',
            )}>
              {items.map(({ label, href, count }) =>
                <Link
                  key={label}
                  href={href}
                  className={clsx(
                    'flex gap-0.5',
                    checkPathPrefix(pathname, href) ? 'font-bold' : 'text-dim',
                  )}
                  prefetch={false}
                >
                  <span>{label}</span>
                  {count > 0 &&
                    <span>({count})</span>}
                </Link>)}
            </div>
            <Link
              href={PATH_ADMIN_CONFIGURATION}
              className={isPathAdminConfiguration(pathname)
                ? 'font-bold'
                : 'text-dim'}
            >
              <BiCog
                size={18}
                className="inline-block"
                aria-label="App Configuration"
              />
            </Link>
          </div>
          {shouldShowBanner &&
            <InfoBlock centered={false} padding="tight" color="blue">
              <div className="flex items-center gap-3">
                <FaRegClock className="flex-shrink-0" />
                Photo updates detected—they may take several minutes to show up
                for visitors
              </div>
            </InfoBlock>}
        </div>
      }
    />
  );
}
