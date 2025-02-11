'use client';

import Note from '@/components/Note';
import { dateRangeForPhotos, PhotoDateRange } from '@/photo';
import clsx from 'clsx/lite';
import { FaCodeFork } from 'react-icons/fa6';

export default function AdminAppInsightsClient({
  photosCount,
  tagsCount,
  camerasCount,
  filmSimulationsCount,
  lensesCount,
  dateRange,
}: {
  photosCount: number
  tagsCount: number
  camerasCount: number
  filmSimulationsCount: number
  lensesCount: number
  dateRange?: PhotoDateRange
}) {
  const { descriptionWithSpaces } = dateRangeForPhotos(undefined, dateRange);

  return (
    <div className={clsx(
      'flex flex-col items-center justify-center gap-4',
      'mt-2 mb-6',
    )}>
      <div className="text-center text-main uppercase font-bold tracking-wide">
        Template Recommendations
      </div>
      <Note
        icon={<FaCodeFork />}
        className="w-[clamp(300px,80%,1000px)] m-auto"
      >
        Consider forking this repository in order to
        receive new features and fixes
      </Note>
      <div className="text-center text-main uppercase font-bold tracking-wide">
        Library Stats
      </div>
      <div className={clsx(
        'grid grid-cols-2 gap-3 uppercase',
        'border border-main rounded-md p-6 bg-main shadow-xs',
        'w-[clamp(300px,80%,1000px)]',
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
  );
}
