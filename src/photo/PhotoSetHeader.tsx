import { clsx } from 'clsx/lite';
import { Photo, PhotoDateRange, dateRangeForPhotos } from '.';
import ShareButton from '@/components/ShareButton';
import AnimateItems from '@/components/AnimateItems';
import { ReactNode } from 'react';
import { HIGH_DENSITY_GRID } from '@/site/config';
import DivDebugBaselineGrid from '@/components/DivDebugBaselineGrid';

export default function PhotoSetHeader({
  entity,
  entityVerb,
  entityDescription,
  photos,
  selectedPhoto,
  sharePath,
  count,
  dateRange,
}: {
  entity: ReactNode
  entityVerb: string
  entityDescription: string
  photos: Photo[]
  selectedPhoto?: Photo
  sharePath: string
  count?: number
  dateRange?: PhotoDateRange
}) {
  const { start, end } = dateRangeForPhotos(photos, dateRange);

  const selectedPhotoIndex = selectedPhoto
    ? photos.findIndex(photo => photo.id === selectedPhoto.id)
    : undefined;

  return (
    <AnimateItems
      type="bottom"
      distanceOffset={10}
      animateOnFirstLoadOnly
      items={[<DivDebugBaselineGrid
        key="PhotosHeader"
        className={clsx(
          'grid gap-0.5 sm:gap-1 items-start',
          HIGH_DENSITY_GRID
            ? 'xs:grid-cols-2 sm:grid-cols-4 lg:grid-cols-5'
            : 'xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4',
        )}>
        <span className={clsx(
          'inline-flex',
          HIGH_DENSITY_GRID && 'sm:col-span-2',
        )}>
          {entity}
        </span>
        <span className={clsx(
          'inline-flex gap-2 self-start',
          'uppercase text-dim',
          HIGH_DENSITY_GRID
            ? 'lg:col-span-2'
            : 'sm:col-span-2 md:col-span-1 lg:col-span-2',
        )}>
          {selectedPhotoIndex !== undefined
            // eslint-disable-next-line max-len
            ? `${entityVerb} ${selectedPhotoIndex + 1} of ${count ?? photos.length}`
            : entityDescription}
          {selectedPhotoIndex === undefined &&
            <ShareButton
              className="translate-y-[1.5px]"
              path={sharePath}
              dim
            />}
        </span>
        <span className={clsx(
          'hidden sm:inline-block',
          'text-right uppercase',
          'text-dim',
        )}>
          {start === end
            ? start
            : <>{end}<br />– {start}</>}
        </span>
      </DivDebugBaselineGrid>]}
    />
  );
}
