'use client';

import { clsx } from 'clsx/lite';
import {
  Photo,
  PhotoDateRangePostgres,
  formattedDateRangeForPhotos,
  titleForPhoto,
} from '.';
import { PhotoSetCategory } from '../category';
import ShareButton from '@/share/ShareButton';
import AnimateItems from '@/components/AnimateItems';
import { Fragment, ReactNode } from 'react';
import DivDebugBaselineGrid from '@/components/DivDebugBaselineGrid';
import PhotoPrevNextActions from './PhotoPrevNextActions';
import PhotoLink from './PhotoLink';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import { useAppState } from '@/app/AppState';
import { GRID_GAP_CLASSNAME } from '@/components';
import { useAppText } from '@/i18n/state/client';
import { MASONRY_GRID_ENABLED, UPPERCASE_TITLES } from '@/app/config';
import SwitchPrimitive from '@/components/primitives/SwitchPrimitive';
import IconFull from '@/components/icons/IconFull';
import IconGrid from '@/components/icons/IconGrid';
import IconGridMasonry from '@/components/icons/IconGridMasonry';

export default function PhotoHeader({
  photos,
  selectedPhoto,
  entity,
  entityVerb: _entityVerb,
  entityDescription,
  entitySubhead,
  indexNumber,
  count,
  dateRange,
  richContent,
  hasAiTextGeneration,
  includeShareButton,
  ...categories
}: {
  photos: Photo[]
  selectedPhoto?: Photo
  entity?: ReactNode
  entityVerb?: string
  entityDescription?: string
  entitySubhead?: string
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRangePostgres
  richContent?: ReactNode
  hasAiTextGeneration: boolean
  includeShareButton?: boolean
} & PhotoSetCategory) {
  const {
    isGridHighDensity,
    isPhotoSetFull,
    setIsPhotoSetFull,
  } = useAppState();

  const appText = useAppText();

  const entityVerb = _entityVerb ?? appText.photo.photo.toLocaleUpperCase();

  const { start, end } = formattedDateRangeForPhotos(photos, dateRange);

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

  const renderContentA = entity
    ? <div>
      <div>{entity}</div>
      {entitySubhead &&
        <div className="text-dim whitespace-normal">
          {entitySubhead}
        </div>}
    </div>
    : (
      selectedPhoto !== undefined &&
        <PhotoLink
          photo={selectedPhoto}
          className={clsx(
            'font-bold truncate',
            UPPERCASE_TITLES && 'uppercase',
          )}
        >
          {titleForPhoto(selectedPhoto, true)}
        </PhotoLink>);

  const renderTitle = headerType === 'photo-detail-with-entity'
    ? renderContentA
    // Necessary for title truncation
    : <h1 className={clsx(
      'w-full truncate',
      headerType !== 'photo-detail' && 'pr-1 sm:pr-2',
      // Counteract dimmed container when shown alongside entity meta
      headerType === 'photo-set' && 'text-main',
    )}>
      {renderContentA}
    </h1>;

  const classNameIconFull = isPhotoSetFull ? 'text-main' : 'text-dim';
  const classNameIconGrid = isPhotoSetFull ? 'text-dim' : 'text-main';

  const renderViewSwitcher =
    <span className="inline-flex items-center gap-1">
      <IconFull className={classNameIconFull} />
      <SwitchPrimitive
        checked={!isPhotoSetFull}
        onCheckedChange={isGrid => setIsPhotoSetFull?.(!isGrid)}
        label={appText.nav.grid}
      />
      {MASONRY_GRID_ENABLED
        ? <IconGridMasonry className={classNameIconGrid} />
        : <IconGrid className={classNameIconGrid} />}
    </span>;

  // Grid/full switcher on photo sets, photo title on photo details
  const renderColumnSwitcher =
    <div className={clsx(
      'inline-flex',
      headerType !== 'photo-set' &&
        (headerType !== 'photo-detail' || UPPERCASE_TITLES) &&
        'uppercase',
      headerType === 'photo-set'
        ? 'col-span-2 sm:col-span-1'
        : headerType === 'photo-detail-with-entity'
          ? isGridHighDensity
            ? 'col-span-2 lg:col-span-3'
            : 'col-span-2 md:col-span-1 lg:col-span-2'
          : isGridHighDensity
            ? 'col-span-3 sm:col-span-3 lg:col-span-5 w-[110%] xl:w-full'
            : 'col-span-3 md:col-span-2 lg:col-span-3 w-[110%] xl:w-full',
    )}>
      {headerType === 'photo-set'
        ? renderViewSwitcher
        : renderTitle}
    </div>;

  // Set title/description/share on photo sets, pagination on photo details
  const renderColumnMeta =
    <div className={clsx(
      'inline-flex gap-1 self-start',
      'uppercase text-dim',
      headerType === 'photo-set'
        ? isGridHighDensity
          ? 'col-span-2 lg:col-span-4'
          : 'col-span-2 md:col-span-1 lg:col-span-2'
        : headerType === 'photo-detail-with-entity'
          ? isGridHighDensity
            ? 'col-span-1 lg:col-span-2'
            : 'col-span-1'
          : 'hidden!',
    )}>
      {headerType === 'photo-set'
        ? <div className="min-w-0 grow">
          {renderTitle}
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
        </div>
        : entity &&
          <ResponsiveText
            shortText={appText.utility.paginate(
              paginationIndex,
              paginationCount,
            )}
          >
            {appText.utility.paginateAction(
              paginationIndex,
              paginationCount,
              entityVerb)}
          </ResponsiveText>}
    </div>;

  const renderBlock = (content: ReactNode) =>
    <DivDebugBaselineGrid
      className={clsx(
        'grid',
        GRID_GAP_CLASSNAME,
        'items-start',
        'grid-cols-4',
        isGridHighDensity
          ? 'lg:grid-cols-6'
          : 'md:grid-cols-3 lg:grid-cols-4',
      )}
    >
      {content}
    </DivDebugBaselineGrid>;

  return (
    <AnimateItems
      type="bottom"
      distanceOffset={10}
      animateOnFirstLoadOnly
      items={[<Fragment key="PhotoHeader">
        {renderBlock(<>
          {/* Photo sets lead with title/meta, details with the photo title */}
          {headerType === 'photo-set'
            ? <>{renderColumnMeta}{renderColumnSwitcher}</>
            : <>{renderColumnSwitcher}{renderColumnMeta}</>}
          {/* Content C: Nav */}
          <div className={clsx(
            headerType === 'photo-set'
              ? 'hidden sm:flex'
              : 'flex',
            'justify-end',
            // Make full height for prev/next symbols
            'max-sm:h-full',
          )}>
            {selectedPhoto
              ? renderPrevNext
              : renderDateRange}
          </div>
        </>)}
        {richContent && renderBlock(
          <div className={clsx(
            // Use 2/3 or 3/4 grid on larger screens
            'col-span-4',
            isGridHighDensity
              ? 'lg:col-span-4'
              : 'lg:col-span-3',
            'mt-12',
          )}>
            {richContent}
          </div>,
        )}
      </Fragment>]}
    />
  );
}
