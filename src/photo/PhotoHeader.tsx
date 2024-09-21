'use client';

import { clsx } from 'clsx/lite';
import {
  Photo,
  PhotoDateRange,
  PhotoSetAttributes,
  dateRangeForPhotos,
  titleForPhoto,
} from '.';
import ShareButton from '@/components/ShareButton';
import AnimateItems from '@/components/AnimateItems';
import { ReactNode } from 'react';
import DivDebugBaselineGrid from '@/components/DivDebugBaselineGrid';
import PhotoPrevNext from './PhotoPrevNext';
import PhotoLink from './PhotoLink';
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

  const headerType = selectedPhotoIndex === undefined
    ? 'photo-set'
    : entity
      ? 'photo-detail-with-entity'
      : 'photo-detail';

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

  const renderContentA = () => entity ?? (
    selectedPhoto !== undefined &&
      <PhotoLink
        photo={selectedPhoto}
        className="uppercase font-bold text-ellipsis truncate"
      >
        {titleForPhoto(selectedPhoto, true)}
      </PhotoLink>);

  return (
    <AnimateItems
      type="bottom"
      distanceOffset={10}
      animateOnFirstLoadOnly
      items={[<DivDebugBaselineGrid
        key="PhotosHeader"
        className={clsx(
          'grid gap-0.5 sm:gap-1 items-start',
          'grid-cols-4',
          isGridHighDensity
            ? 'lg:grid-cols-6'
            : 'md:grid-cols-3 lg:grid-cols-4',
        )}>
        {/* Content A: Filter Set or Photo Title */}
        <div className={clsx(
          'inline-flex uppercase',
          headerType === 'photo-set'
            ? isGridHighDensity
              ? 'col-span-2 sm:col-span-1 lg:col-span-2'
              : 'col-span-2 sm:col-span-1'
            : headerType === 'photo-detail-with-entity'
              ? isGridHighDensity
                ? 'col-span-2 sm:col-span-1 lg:col-span-2'
                : 'col-span-2 sm:col-span-1'
              : isGridHighDensity
                ? 'col-span-3 sm:col-span-3 lg:col-span-5'
                : 'col-span-3 md:col-span-2 lg:col-span-3',
        )}>
          {headerType === 'photo-detail-with-entity'
            ? renderContentA()
            : <h1>{renderContentA()}</h1>}
        </div>
        {/* Content B: Filter Set Meta or Photo Pagination */}
        <div className={clsx(
          'inline-flex',
          'gap-2 self-start',
          'uppercase text-dim',
          headerType === 'photo-set'
            ? isGridHighDensity
              ? 'col-span-2 lg:col-span-3'
              : 'col-span-2 md:col-span-1 lg:col-span-2'
            : headerType === 'photo-detail-with-entity'
              ? isGridHighDensity
                ? 'sm:col-span-2 lg:col-span-3'
                : 'sm:col-span-2 md:col-span-1 lg:col-span-2'
              : 'hidden',
        )}>
          {entity && <>
            {headerType === 'photo-set'
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
        </div>
        {/* Content C: Nav */}
        <div className={clsx(
          headerType === 'photo-set'
            ? 'hidden sm:flex'
            : 'flex',
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
