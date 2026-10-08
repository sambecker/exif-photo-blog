'use client';

import LinkWithIconLoader from '@/components/LinkWithIconLoader';
import Note from '@/components/Note';
import AppGrid from '@/components/AppGrid';
import Spinner from '@/components/Spinner';
import {
  PATH_ADMIN_CONFIGURATION,
  PATH_ADMIN_INSIGHTS,
  PATH_ADMIN_PHOTOS_UPDATES,
  checkPathPrefix,
  isPathAdminInfo,
  isPathAdminPhotoEdit,
  isPathTopLevelAdmin,
} from '@/app/path';
import { useAppState } from '@/app/AppState';
import { clsx } from 'clsx/lite';
import { differenceInMinutes } from 'date-fns';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaRegClock } from 'react-icons/fa';
import AdminAppInfoIcon from './AdminAppInfoIcon';
import LinkWithLoaderBackground from '@/components/LinkWithLoaderBackground';
import MaskedScroll from '@/components/MaskedScroll';
import StickySubNav from '@/components/StickySubNav';

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
    // Check every 1 second if update times are recent
    const interval = setInterval(() =>
      setHasRecentUpdates(areTimesRecent(updateTimes))
    , 1_000);
    return () => clearInterval(interval);
  }, [updateTimes]);

  const shouldShowBanner =
    hasRecentUpdates &&
    isPathTopLevelAdmin(pathname) &&
    pathname !== PATH_ADMIN_PHOTOS_UPDATES;

  return (
    <>
      <StickySubNav isEnabled={!isPathAdminPhotoEdit(pathname)}>
        <div className={clsx(
          'flex gap-2 pb-3',
          'border-b border-gray-200 dark:border-gray-800',
        )}>
          <MaskedScroll
            className="grow -mx-1 flex gap-1 md:gap-1.5"
            direction="horizontal"
          >
            {items.map(({ label, href }) =>
              <LinkWithLoaderBackground
                key={label}
                href={href}
                className={clsx(
                  checkPathPrefix(pathname, href) ? 'font-bold' : 'text-dim',
                  'hover:text-main active:text-medium',
                )}
                prefetch={false}
              >
                {label}
              </LinkWithLoaderBackground>)}
          </MaskedScroll>
          <LinkWithIconLoader
            href={includeInsights
              ? PATH_ADMIN_INSIGHTS
              : PATH_ADMIN_CONFIGURATION}
            className={clsx(
              isPathAdminInfo(pathname)
                ? 'font-bold'
                : 'text-dim',
              'hover:text-main active:text-dim',
            )}
            icon={<AdminAppInfoIcon />}
            loader={<Spinner className="translate-y-[-0.75px]" />}
          />
        </div>
      </StickySubNav>
      {shouldShowBanner &&
        <AppGrid
          contentMain={
            <Note icon={<FaRegClock className="shrink-0" />}>
              Photo updates detected—they may take several minutes to show
              up for visitors
            </Note>
          }
        />}
    </>
  );
}
