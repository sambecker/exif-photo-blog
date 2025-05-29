'use client';

import { clsx } from 'clsx/lite';
import {
  Photo,
  PhotoDateRange,
  dateRangeForPhotos,
  titleForPhoto,
} from '.';
import { PhotoSetCategory } from '../category';
import ShareButton from '@/share/ShareButton';
import AnimateItems from '@/components/AnimateItems';
import { ReactNode } from 'react';
import DivDebugBaselineGrid from '@/components/DivDebugBaselineGrid';
import PhotoPrevNextActions from './PhotoPrevNextActions';
import PhotoLink from './PhotoLink';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import { useAppState } from '@/state/AppState';
import { GRID_GAP_CLASSNAME } from '@/components';
import { useAppText } from '@/i18n/state/client';

export default function PhotoHeader({
  photos,
  selectedPhoto,
  entity,
  entityVerb: _entityVerb,
  entityDescription,
  indexNumber,
  count,
  dateRange,
  hasAiTextGeneration,
  includeShareButton,
  ...categories
}: {
  photos: Photo[]
  selectedPhoto?: Photo
  entity?: ReactNode
  entityVerb?: string
  entityDescription?: string
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
  hasAiTextGeneration: boolean
  includeShareButton?: boolean
} & PhotoSetCategory) {
  const { isGridHighDensity } = useAppState();

  const appText = useAppText();

  const entityVerb = _entityVerb ?? appText.photo.photo.toLocaleUpperCase();

  const { start, end } = dateRangeForPhotos(photos, dateRange);

  const selectedPhotoIndex = selectedPhoto
    ? photos.findIndex(photo => photo.id === selectedPhoto.id)
    : undefined;

  const paginationIndex = indexNumber || (selectedPhotoIndex ?? 0 + 1);
  const paginationCount = count ?? photos.length;

  const headerType = selectedPhotoIndex === undefined
    ? 'photo-set'
    : entity
      ? 'photo-detail-with-entity'
      : 'photo-detail';

  const renderPrevNext =
    <PhotoPrevNextActions {...{
      photo: selectedPhoto,
      photos,
      hasAiTextGeneration,
      ...categories,
    }} />;

  const renderDateRange =
    <span className="text-dim uppercase text-right">
      {start === end
        ? start
        : <>{end}<br />&ndash; {start}</>}
    </span>;

  const renderContentA = entity ?? (
    selectedPhoto !== undefined &&
      <PhotoLink
        photo={selectedPhoto}
        className="uppercase font-bold truncate"
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
          'grid',
          GRID_GAP_CLASSNAME,
          'items-start',
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
              ? 'col-span-2 lg:col-span-3'
              : 'col-span-2 md:col-span-1 lg:col-span-2'
            : headerType === 'photo-detail-with-entity'
              ? isGridHighDensity
                ? 'col-span-2 lg:col-span-3'
                : 'col-span-2 md:col-span-1 lg:col-span-2'
              : isGridHighDensity
                ? 'col-span-3 sm:col-span-3 lg:col-span-5 w-[110%] xl:w-full'
                : 'col-span-3 md:col-span-2 lg:col-span-3 w-[110%] xl:w-full',
        )}>
          {headerType === 'photo-detail-with-entity'
            ? renderContentA
            // Necessary for title truncation
            : <h1 className={clsx(
              'w-full truncate',
              headerType !== 'photo-detail' && 'pr-1 sm:pr-2',
            )}>
              {renderContentA}
            </h1>}
        </div>
        {/* Content B: Filter Set Meta or Photo Pagination */}
        <div className={clsx(
          'inline-flex gap-1 self-start',
          'uppercase text-dim',
          headerType === 'photo-set'
            ? isGridHighDensity
              ? 'col-span-2 sm:col-span-1 lg:col-span-2'
              : 'col-span-2 sm:col-span-1'
            : headerType === 'photo-detail-with-entity'
              ? isGridHighDensity
                ? 'col-span-1 lg:col-span-2'
                : 'col-span-1'
              : 'hidden!',
        )}>
          {entity && <>
            {headerType === 'photo-set'
              ? <>
                {entityDescription}
                {includeShareButton &&
                  <ShareButton {...{
                    photos,
                    ...categories,
                    count,
                    dateRange,
                    className: 'translate-x-[1px] translate-y-[1.5px] w-4',
                    prefetch: true,
                    dim: true,
                  }} />}
              </>
              : <ResponsiveText
                shortText={appText.utility.paginateAction(
                  paginationIndex,
                  paginationCount,
                  entityVerb,
                )}
              >
                {appText.utility.paginateAction(
                  paginationIndex,
                  paginationCount,
                  entityVerb)}
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
            ? renderPrevNext
            : renderDateRange}
        </div>
      </DivDebugBaselineGrid>,
      ]}
    />
  );
}
