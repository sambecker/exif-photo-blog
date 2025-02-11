'use client';

import { dateRangeForPhotos, PhotoDateRange } from '@/photo';
import clsx from 'clsx/lite';

export default function AdminAppInsightsClient({
  photosCount,
  tagsCount,
  camerasCount,
  dateRange,
}: {
  photosCount: number
  tagsCount: number
  camerasCount: number
  dateRange?: PhotoDateRange
}) {
  const { descriptionWithSpaces } = dateRangeForPhotos(undefined, dateRange);

  return (
    <div className={clsx(
      'flex flex-col items-center justify-center w-full gap-4',
      'mt-2 mb-6',
    )}>
      <div className="text-center text-main uppercase font-bold">
        Photo library
      </div>
      <div className={clsx(
        'grid grid-cols-2 gap-2 uppercase',
        'border border-main rounded-md p-4 bg-main shadow-xs',
        'w-[80%]',
      )}>
        <div className="tracking-wide">Photos</div>
        <div className="text-right">{photosCount}</div>
        <div>Tags</div>
        <div className="text-right">{tagsCount}</div>
        <div>Cameras</div>
        <div className="text-right">{camerasCount}</div>
        <span className="text-center col-span-2">
          {descriptionWithSpaces}
        </span>
      </div>
    </div>
  );
}
