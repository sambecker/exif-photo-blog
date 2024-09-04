'use client';

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
import DivDebugBaselineGrid from '@/components/DivDebugBaselineGrid';
import PhotoPrevNext from './PhotoPrevNext';
import PhotoLink from './PhotoLink';
import { formatDate } from '@/utility/date';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import { useAppState } from '@/state/AppState';

export default function PhotoHeader({
  tag,
  camera,
  simulation,
  focal,
  photos,
  selectedPhoto,
  entity,
  entityVerb = 'PHOTO',
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
  const { isGridHighDensity } = useAppState();

  const { start, end } = dateRangeForPhotos(photos, dateRange);

  const selectedPhotoIndex = selectedPhoto
    ? photos.findIndex(photo => photo.id === selectedPhoto.id)
    : undefined;

  const paginationLabel =
    (indexNumber || (selectedPhotoIndex ?? 0 + 1)) + ' of ' +
    (count ?? photos.length);

  const isPhotoSet = selectedPhotoIndex === undefined;

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
          'grid gap-0.5 sm:gap-1 items-start grid-cols-4',
          isGridHighDensity
            ? 'lg:grid-cols-6'
            : 'md:grid-cols-3 lg:grid-cols-4',
        )}>
        <span className={clsx(
          'inline-flex uppercase',
          isGridHighDensity
            ? 'col-span-2 sm:col-span-1 lg:col-span-2'
            : 'col-span-2 md:col-span-1',
        )}>
          {entity ?? (selectedPhoto !== undefined &&
            <PhotoLink
              photo={selectedPhoto}
              className="uppercase font-bold"
            >
              {
                selectedPhoto.title ||
                formatDate(selectedPhoto.takenAt, 'tiny')
              }
            </PhotoLink>)}
        </span>
        <span className={clsx(
          'inline-flex',
          'gap-2 self-start',
          'uppercase text-dim',
          isPhotoSet
            ? isGridHighDensity
              ? 'col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-3'
              : 'col-span-2 sm:col-span-1 lg:col-span-2'
            : isGridHighDensity
              ? 'sm:col-span-2 lg:col-span-3'
              : 'lg:col-span-2',
        )}>
          {entity && <>
            {isPhotoSet
              ? <>
                {entityDescription}
                {sharePath &&
                  <ShareButton
                    className="translate-y-[1.5px]"
                    path={sharePath}
                    dim
                  />}
              </>
              : <ResponsiveText shortText={paginationLabel}>
                {entityVerb} {paginationLabel}
              </ResponsiveText>}
          </>}
        </span>
        <div className={clsx(
          selectedPhoto ? 'flex' : 'hidden sm:flex',
          'justify-end',
        )}>
          {selectedPhoto
            ? renderPrevNext()
            : renderDateRange()}
        </div>
      </DivDebugBaselineGrid>,
      ]}
    />
  );
}
