'use client';

import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
  shouldShowCameraDataForPhoto,
  shouldShowExifDataForPhoto,
  shouldShowFilmDataForPhoto,
  shouldShowLensDataForPhoto,
  shouldShowRecipeDataForPhoto,
} from '.';
import ImageLarge from '@/components/image/ImageLarge';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { pathForFocalLength, pathForPhoto } from '@/app/path';
import PhotoTags from '@/tag/PhotoTags';
import PhotoCamera from '../camera/PhotoCamera';
import { cameraFromPhoto } from '@/camera';
import PhotoFilm from '@/film/PhotoFilm';
import { sortTagsArray } from '@/tag';
import DivDebugBaselineGrid from '@/components/DivDebugBaselineGrid';
import PhotoLink from './PhotoLink';
import {
  SHOULD_PREFETCH_ALL_LINKS,
  SHOW_TAKEN_AT_TIME,
  ALWAYS_SHOW_EXPOSURE_COMP,
  UPPERCASE_TITLES,
  PHOTO_TITLE_SERIF,
  GEO_PRIVACY_ENABLED,
} from '@/app/config';
import AdminPhotoMenu from '@/admin/AdminPhotoMenu';
import { RevalidatePhoto } from './InfinitePhotoScroll';
import { useCallback, useMemo, useRef } from 'react';
import useVisibility from '@/utility/useVisibility';
import PhotoDate from './PhotoDate';
import { useAppState } from '@/app/AppState';
import Tooltip from '@/components/Tooltip';
import ZoomControls, { ZoomControlsRef }
  from '@/components/image/zoom/ZoomControls';
import { AnimatePresence } from 'framer-motion';
import useRecipeOverlay from '../recipe/useRecipeOverlay';
import PhotoRecipeOverlay from '@/recipe/PhotoRecipeOverlay';
import PhotoRecipe from '@/recipe/PhotoRecipe';
import PhotoLens from '@/lens/PhotoLens';
import { lensFromPhoto } from '@/lens';
import { useAppText } from '@/i18n/state/client';
import AdminPhotoStorageCheck from '@/admin/storage/AdminPhotoStorageCheck';
import { useEditTitlesState } from '@/admin/edit-titles/EditTitlesState';
import { DATA_KEY_PHOTO_LARGE } from '@/admin/edit-titles/EditTitlesProvider';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import PlaceEntity from '@/place/PlaceEntity';
import PhotoColorBar from './color/PhotoColorBar';

export default function PhotoFloating({
  photo,
  className,
  metaSide = 'left',
  priority,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  prefetchRelatedLinks = SHOULD_PREFETCH_ALL_LINKS,
  revalidatePhoto,
  showZoomControls: _showZoomControls = true,
  shouldZoomOnFKeydown = true,
  includeFavoriteInAdminMenu,
  onVisible,
  showAdminKeyCommands,
  showStorageCheck,
}: {
  photo: Photo
  className?: string
  metaSide?: 'left' | 'right'
  priority?: boolean
  prefetch?: boolean
  prefetchRelatedLinks?: boolean
  revalidatePhoto?: RevalidatePhoto
  showZoomControls?: boolean
  shouldZoomOnFKeydown?: boolean
  includeFavoriteInAdminMenu?: boolean
  onVisible?: () => void
  showAdminKeyCommands?: boolean
  showStorageCheck?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null);
  const refZoomControls = useRef<ZoomControlsRef>(null);
  const refPhotoRecipe = useRef<HTMLDivElement>(null);
  const refPhotoFilm = useRef<HTMLDivElement>(null);

  const {
    areZoomControlsShown,
    shouldDebugRecipeOverlays,
    isUserSignedIn,
  } = useAppState();

  const {
    isEditingTitles,
    getPhotoEdit,
    setPhotoEdit,
    isPerformingUpdate,
  } = useEditTitlesState();

  const appText = useAppText();

  const photoEditOriginal = useMemo(() => ({
    title: photo.title ?? '',
    caption: photo.caption ?? '',
  }), [photo.title, photo.caption]);

  const photoEdit = isEditingTitles
    ? getPhotoEdit?.(photo.id, photoEditOriginal) ?? photoEditOriginal
    : photoEditOriginal;

  const showZoomControls = _showZoomControls && areZoomControlsShown;
  const selectZoomImageElement = useCallback(
    (container: HTMLElement | null) => Array
      .from(container?.getElementsByTagName('img') ?? [])
      .filter((img) => !img.src.startsWith('data:image'))[0]
    , []);

  const refRecipe = useRef<HTMLDivElement>(null);
  const refTriggers = useMemo(() => [
    refPhotoRecipe,
    refPhotoFilm,
  ], []);
  const {
    isShowingRecipeOverlay,
    hideRecipeOverlay,
  } = useRecipeOverlay({
    ref: refRecipe,
    refTriggers,
  });

  const tags = sortTagsArray(photo.tags);
  const camera = cameraFromPhoto(photo);
  const lens = lensFromPhoto(photo);
  const { recipeTitle } = photo;

  const showExifContent = shouldShowExifDataForPhoto(photo);
  const showCameraContent = shouldShowCameraDataForPhoto(photo);
  const showLensContent = shouldShowLensDataForPhoto(photo);
  const showTagsContent = tags.length > 0;
  const showRecipeContent = shouldShowRecipeDataForPhoto(photo);
  const showFilmContent = shouldShowFilmDataForPhoto(photo);
  const showPlaceContent =
    Boolean(photo.location) &&
    !GEO_PRIVACY_ENABLED;
  const has35mmEquivalent =
    Boolean(photo.focalLengthIn35MmFormatFormatted) &&
    photo.focalLengthIn35MmFormatFormatted !== photo.focalLengthFormatted;
  const focalLengthLink = photo.focalLength
    ? <Link
      href={pathForFocalLength(photo.focalLength)}
      className={clsx(
        'hover:text-main active:text-medium',
        has35mmEquivalent && clsx(
          'decoration-dotted underline-offset-[3px]',
          'hover:underline',
        ),
      )}
    >
      {photo.focalLengthFormatted}
    </Link>
    : null;

  useVisibility({ ref, onVisible });

  const hasTitle = Boolean(photo.title);
  const hasTitleContent =
    isEditingTitles ||
    hasTitle ||
    Boolean(photo.caption);
  const hasMetaContent =
    showCameraContent ||
    showLensContent ||
    showTagsContent ||
    showRecipeContent ||
    showFilmContent ||
    showPlaceContent ||
    showExifContent;
  const hasNonDateContent =
    hasTitleContent ||
    hasMetaContent;

  const renderPhotoLink =
    <div className={clsx(
      PHOTO_TITLE_SERIF && 'mb-1.5 md:mb-5',
    )}>
      <PhotoLink
        photo={photo}
        className={clsx(
          PHOTO_TITLE_SERIF
            // Instrument Serif only ships weight 400
            ? 'font-serif font-normal text-[1.25rem] sm:text-[1.5rem] leading-snug'
            : 'font-bold grow',
          UPPERCASE_TITLES && 'uppercase',
        )}
        prefetch={prefetch}
      />
    </div>;

  // Desktop matte inset (md+); mobile stays full-width like unmatted PhotoLarge
  const matteContentWidthForAspectRatio =
    photo.aspectRatio > 3 / 2 + 0.1
      ? 'md:w-[90%]'
      : photo.aspectRatio >= 1
        ? 'md:w-[80%]'
        : undefined;

  const renderLargePhoto =
    <div className={clsx(
      'relative',
      'md:flex md:items-center md:justify-center',
      'md:h-[90%]',
      matteContentWidthForAspectRatio,
    )}>
      <ZoomControls
        ref={refZoomControls}
        selectImageElement={selectZoomImageElement}
        {...{ isEnabled: showZoomControls, shouldZoomOnFKeydown }}
      >
        <ImageLarge
          className="w-full md:h-full"
          classNameImage="w-full md:object-contain md:h-full"
          alt={altTextForPhoto(photo)}
          src={photo.url}
          aspectRatio={photo.aspectRatio}
          blurDataURL={photo.blurData}
          blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
          loading={priority ? 'eager' : undefined}
        />
      </ZoomControls>
      <div className={clsx(
        'absolute inset-0',
        'flex items-center justify-center',
        !(isShowingRecipeOverlay || shouldDebugRecipeOverlays) &&
          'pointer-events-none',
      )}>
        <AnimatePresence>
          {(isShowingRecipeOverlay || shouldDebugRecipeOverlays) &&
            photo.recipeData &&
            photo.film &&
              <PhotoRecipeOverlay
                ref={refRecipe}
                title={photo.recipeTitle}
                data={photo.recipeData}
                film={photo.film}
                iso={photo.isoFormatted}
                exposure={photo.exposureCompensationFormatted}
                onClose={hideRecipeOverlay}
              />}
        </AnimatePresence>
      </div>
    </div>;

  const renderAdminMenu = (placement?: 'down-right') =>
    <AdminPhotoMenu {...{
      photo,
      revalidatePhoto,
      includeFavorite: includeFavoriteInAdminMenu,
      showKeyCommands: showAdminKeyCommands,
      // Meta on left: drop below the trigger and extend toward the photo
      ...placement === 'down-right' && {
        side: 'bottom',
        align: 'start',
      },
    }} />;

  const photoContainerClassName = clsx(
    // Mobile: full-width within site margins (PhotoLarge); md+: matted 3:2
    'w-full',
    'md:flex md:items-center md:justify-center md:aspect-3/2',
  );

  const metaAlignClass = metaSide === 'left'
    ? 'md:text-right md:items-end'
    : 'md:text-left md:items-start';

  const renderMeta =
    <DivDebugBaselineGrid className={clsx(
      'flex flex-col gap-y-2 md:gap-y-baseline',
      'w-full md:w-48 lg:w-56 shrink-0',
      metaAlignClass,
    )}>
      <div className={clsx(
        'w-full',
        'grid grid-cols-2 md:grid-cols-1',
        'gap-x-0.5 sm:gap-x-1',
        'gap-y-2 md:gap-y-baseline',
      )}>
        <div className="pr-3 md:pr-0">
          {!isEditingTitles &&
            <div className={clsx(
              // Mirror corners:
              // top-right when meta is right, top-left when left
              // (avoid flex on this parent — it disables float)
              'hidden md:block',
              metaSide === 'left' ? 'float-start' : 'float-end',
            )}>
              {renderAdminMenu(metaSide === 'left' ? 'down-right' : undefined)}
            </div>}
          {isEditingTitles
            ? <div className={clsx(
              'space-y-2 mb-2 w-full',
              'md:[&_input]:text-sm',
            )}>
              <FieldsetWithStatus
                id={`edit-title-${photo.id}`}
                label="Title"
                value={photoEdit.title}
                onChange={title => setPhotoEdit?.(
                  photo.id,
                  { title },
                  photoEditOriginal,
                )}
                placeholder="Title"
                readOnly={isPerformingUpdate}
                className={clsx(
                  '[&_input]:font-bold',
                  '[&_input]:outline-2',
                )}
                hideLabel
              />
              <FieldsetWithStatus
                id={`edit-caption-${photo.id}`}
                label="Caption"
                value={photoEdit.caption}
                onChange={caption => setPhotoEdit?.(
                  photo.id,
                  { caption },
                  photoEditOriginal,
                )}
                placeholder="Caption"
                readOnly={isPerformingUpdate}
                className="[&_input]:outline-2"
                hideLabel
              />
            </div>
            : hasTitle && renderPhotoLink}
          <div className={clsx(
            'space-y-1.5 md:space-y-baseline',
            metaSide === 'left' && 'md:flex md:flex-col md:items-end',
          )}>
            {!isEditingTitles && photo.caption &&
              <div className={clsx(UPPERCASE_TITLES && 'uppercase')}>
                {photo.caption}
              </div>}
            {(
              showCameraContent ||
              showLensContent ||
              showRecipeContent ||
              showPlaceContent ||
              showTagsContent
            ) &&
              <div className={clsx(
                metaSide === 'left' && 'md:flex md:flex-col md:items-end',
              )}>
                {(showCameraContent || showLensContent) &&
                  <div className={clsx(
                    'flex flex-col',
                    metaSide === 'left'
                      ? 'md:*:self-end *:self-start'
                      : '*:self-start',
                  )}>
                    {showCameraContent &&
                      <PhotoCamera
                        camera={camera}
                        type="text-only"
                        contrast="medium"
                        prefetch={prefetchRelatedLinks}
                      />}
                    {showLensContent &&
                      <PhotoLens
                        lens={lens}
                        type="text-only"
                        contrast="medium"
                        prefetch={prefetchRelatedLinks}
                      />}
                  </div>}
                {showRecipeContent && recipeTitle &&
                  <PhotoRecipe
                    ref={refPhotoRecipe}
                    recipe={recipeTitle}
                    type="text-only"
                    contrast="medium"
                    prefetch={prefetchRelatedLinks}
                  />}
                {showTagsContent &&
                  <PhotoTags
                    tags={tags}
                    contrast="medium"
                    prefetch={prefetchRelatedLinks}
                  />}
              </div>}
          </div>
        </div>
        <div className={clsx(
          'relative',
          'space-y-1.5 md:space-y-baseline',
          // Mobile: left-align with date in column 2; md+ follows meta side
          'flex flex-col items-start',
          metaSide === 'left' ? 'md:items-end' : 'md:items-start',
          !hasTitleContent && !hasMetaContent && 'md:-mt-baseline',
          // Room for absolutely positioned ••• (float is ignored inside flex)
          isUserSignedIn && !isEditingTitles && 'max-md:pr-7',
        )}>
          {!isEditingTitles &&
            <div className="absolute top-0 right-0 z-10 md:hidden">
              {renderAdminMenu()}
            </div>}
          {showExifContent &&
            <>
              <ul className="text-medium">
                {(photo.focalLength || photo.isoFormatted) &&
                  <li className={clsx(
                    'flex gap-x-3',
                    metaSide === 'left' && 'md:justify-end',
                  )}>
                    {focalLengthLink && (has35mmEquivalent
                      ? <Tooltip
                        content={`${appText.tooltip['35mm']}: ${
                          photo.focalLengthIn35MmFormatFormatted
                        }`}
                        sideOffset={3}
                        supportMobile
                        triggerIsFocusable
                      >
                        {focalLengthLink}
                      </Tooltip>
                      : focalLengthLink)}
                    {photo.isoFormatted &&
                      <span>{photo.isoFormatted}</span>}
                  </li>}
                {(
                  photo.fNumberFormatted ||
                  photo.exposureTimeFormatted ||
                  photo.exposureCompensationFormatted ||
                  ALWAYS_SHOW_EXPOSURE_COMP
                ) &&
                  <li className={clsx(
                    'flex gap-x-3',
                    metaSide === 'left' && 'md:justify-end',
                  )}>
                    {photo.fNumberFormatted &&
                      <span>{photo.fNumberFormatted}</span>}
                    {photo.exposureTimeFormatted &&
                      <span>{photo.exposureTimeFormatted}</span>}
                    {photo.exposureCompensationFormatted
                      ? <span>{photo.exposureCompensationFormatted}</span>
                      : ALWAYS_SHOW_EXPOSURE_COMP && <span>0ev</span>}
                  </li>}
              </ul>
              {showFilmContent && photo.film &&
                <PhotoFilm
                  ref={refPhotoFilm}
                  film={photo.film}
                  make={photo.make}
                  prefetch={prefetchRelatedLinks}
                />}
              {showPlaceContent && photo.location &&
                <div>
                  <PlaceEntity
                    place={photo.location}
                    contrast="low"
                    className="-translate-x-0.5"
                  />
                </div>}
            </>}
          <PhotoColorBar colorData={photo.colorData} />
          <PhotoDate
            photo={photo}
            className={clsx(
              'text-medium',
              // Clear space for floated admin menu
              !hasNonDateContent && isUserSignedIn && (
                metaSide === 'left' ? 'md:pl-7' : 'md:pr-7'
              ),
            )}
            timezone={null}
            hideTime={!SHOW_TAKEN_AT_TIME}
          />
          {showStorageCheck &&
            <AdminPhotoStorageCheck photo={photo} />}
        </div>
      </div>
    </DivDebugBaselineGrid>;

  return (
    <div
      ref={ref}
      className={clsx(
        'w-full flex justify-center',
        className,
      )}
      {...{ [DATA_KEY_PHOTO_LARGE]: true }}
    >
      <div className={clsx(
        'w-full max-w-[1400px]',
        'flex flex-col items-center',
        'gap-2 md:gap-6',
        'md:flex-row md:justify-center',
        // Meta left of photo:
        // Reverse row so photo stays first in DOM for mobile
        metaSide === 'left' && 'md:flex-row-reverse',
      )}>
        <div className="w-full md:flex-1 md:min-w-0 max-w-4xl">
          {showZoomControls
            ? <div className={photoContainerClassName}>
              {renderLargePhoto}
            </div>
            : <Link
              href={pathForPhoto({ photo })}
              className={photoContainerClassName}
              prefetch={prefetch}
            >
              {renderLargePhoto}
            </Link>}
        </div>
        {renderMeta}
      </div>
    </div>
  );
}
