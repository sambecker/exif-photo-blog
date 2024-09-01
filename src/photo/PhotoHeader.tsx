import { clsx } from 'clsx/lite';
import {
  Photo,
  PhotoDateRange,
  PhotoSetAttributes,
  dateRangeForPhotos,
} from '.';
import ShareButton from '@/components/ShareButton';
import AnimateItems from '@/components/AnimateItems';
import { ReactNode } from 'react';
import {
  HIGH_DENSITY_GRID,
  SHOW_PHOTO_TITLE_FALLBACK_TEXT,
} from '@/site/config';
import DivDebugBaselineGrid from '@/components/DivDebugBaselineGrid';
import PhotoPrevNext from './PhotoPrevNext';
import PhotoLink from './PhotoLink';

export default function PhotoHeader({
  tag,
  camera,
  simulation,
  focal,
  photos,
  selectedPhoto,
  entity,
  entityVerb,
  entityDescription,
  sharePath,
  indexNumber,
  count,
  dateRange,
}: {
  photos: Photo[]
  selectedPhoto?: Photo
  entity?: ReactNode
  entityVerb?: string
  entityDescription?: string
  sharePath?: string
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
} & PhotoSetAttributes) {
  const { start, end } = dateRangeForPhotos(photos, dateRange);

  const selectedPhotoIndex = selectedPhoto
    ? photos.findIndex(photo => photo.id === selectedPhoto.id)
    : undefined;

  const renderPrevNext = () =>
    <PhotoPrevNext {...{
      photo: selectedPhoto,
      photos,
      tag,
      camera,
      simulation,
      focal,
    }} />;

  const renderDateRange = () =>
    <span className="text-dim uppercase text-right">
      {start === end
        ? start
        : <>{end}<br />– {start}</>}
    </span>;

  return (
    <AnimateItems
      type="bottom"
      distanceOffset={10}
      animateOnFirstLoadOnly
      items={[<DivDebugBaselineGrid
        key="PhotosHeader"
        className={clsx(
          'grid gap-0.5 sm:gap-1 items-start grid-cols-2',
          HIGH_DENSITY_GRID
            ? 'sm:grid-cols-4 lg:grid-cols-5'
            : 'sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4',
        )}>
        <span className={clsx(
          'inline-flex uppercase',
          HIGH_DENSITY_GRID && 'sm:col-span-2',
        )}>
          {entity ?? (
            (selectedPhoto?.title || SHOW_PHOTO_TITLE_FALLBACK_TEXT)
              ? <PhotoLink
                photo={selectedPhoto}
                className="uppercase font-bold"
              />
              : <>X of X</>
          )}
        </span>
        <span className={clsx(
          'hidden sm:block',
          'inline-flex gap-2 self-start',
          'uppercase text-dim',
          HIGH_DENSITY_GRID
            ? 'lg:col-span-2'
            : 'sm:col-span-2 md:col-span-1 lg:col-span-2',
        )}>
          {entity && <>
            {selectedPhotoIndex !== undefined
              // eslint-disable-next-line max-len
              ? `${entityVerb ? `${entityVerb} ` : ''}${indexNumber || (selectedPhotoIndex + 1)} of ${count ?? photos.length}`
              : entityDescription}
            {selectedPhotoIndex === undefined && sharePath &&
              <ShareButton
                className="translate-y-[1.5px]"
                path={sharePath}
                dim
              />}
          </>}
        </span>
        <div className="flex justify-end">
          {selectedPhoto
            ? renderPrevNext()
            : renderDateRange()}
        </div>
      </DivDebugBaselineGrid>,
      ]}
    />
  );
}
