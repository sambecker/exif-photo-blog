'use client';

import IconGrSync from '@/app-core/IconGrSync';
import Note from '@/components/Note';
import WarningNote from '@/components/WarningNote';
import { dateRangeForPhotos, PhotoDateRange } from '@/photo';
import clsx from 'clsx/lite';
import { HiSparkles } from 'react-icons/hi';

type Recommendation =
  'fork' |
  'forkBehind' |
  'ai' |
  'aiRateLimiting';

export default function AdminAppInsightsClient({
  recommendations: {
    fork,
    forkBehind,
    ai,
    aiRateLimiting,
  },
  photoStats: {
    photosCount,
    tagsCount,
    camerasCount,
    filmSimulationsCount,
    lensesCount,
    dateRange,
  },
  debug,
}: {
  recommendations: Record<Recommendation, boolean>,
  photoStats: {
    photosCount: number
    tagsCount: number
    camerasCount: number
    filmSimulationsCount: number
    lensesCount: number
    dateRange?: PhotoDateRange
  },
  debug?: boolean,
}) {

  const { descriptionWithSpaces } = dateRangeForPhotos(undefined, dateRange);

  const renderTitle = (title: string) =>
    <div className={clsx(
      'text-center uppercase font-bold tracking-wide',
      'text-medium',
    )}>
      {title}
    </div>;

  return (
    <div className={clsx(
      'flex flex-col items-center w-full',
      'mt-2 mb-1',
    )}>
      <div className={clsx(
        'w-full sm:w-[80%]',
        'space-y-4 md:space-y-6',
      )}>
        {renderTitle('Code Observability')}
        {(fork || debug) &&
          <Note icon={<IconGrSync />}>
            Consider forking this repository to receive new features and fixes
          </Note>}
        {(forkBehind || debug) &&
          <WarningNote>
            This fork is 9 commits behind
          </WarningNote>}
        {renderTitle('Template Recommendations')}
        {(ai || debug) && <Note icon={<HiSparkles />}>
          Enable AI text generation in the app configuration
        </Note>}
        {(aiRateLimiting || debug) && <WarningNote>
          Consider enabling rate limiting to mitigate AI abuse
        </WarningNote>}
        {renderTitle('Library Stats')}
        <div className={clsx(
          'grid grid-cols-2 gap-3 w-full',
          'border border-main rounded-md p-6 bg-main shadow-xs',
          'uppercase',
        )}>
          <div className="tracking-wide">Photos</div>
          <div className="text-right">{photosCount}</div>
          <div className="tracking-wide">Tags</div>
          <div className="text-right">{tagsCount}</div>
          <div className="tracking-wide">Cameras</div>
          <div className="text-right">{camerasCount}</div>
          <div className="tracking-wide">Films</div>
          <div className="text-right">{filmSimulationsCount}</div>
          <div className="tracking-wide">Lenses</div>
          <div className="text-right">{lensesCount}</div>
          <span className="text-center col-span-2">
            {descriptionWithSpaces}
          </span>
        </div>
      </div>
    </div>
  );
}
