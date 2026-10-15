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
import ShareButton from '@/share/ShareButton';
import DownloadButton from '@/components/DownloadButton';
import PhotoCamera from '../camera/PhotoCamera';
import { cameraFromPhoto } from '@/camera';
import PhotoFilm from '@/film/PhotoFilm';
import { sortTagsArray } from '@/tag';
import DivDebugBaselineGrid from '@/components/DivDebugBaselineGrid';
import PhotoLink from './PhotoLink';
import {
  SHOULD_PREFETCH_ALL_LINKS,
  ALLOW_PUBLIC_DOWNLOADS,
  SHOW_TAKEN_AT_TIME,
  ALWAYS_SHOW_EXPOSURE_COMP,
  UPPERCASE_TITLES,
  GEO_PRIVACY_ENABLED,
} from '@/app/config';
import AdminPhotoMenu from '@/admin/AdminPhotoMenu';
import { RevalidatePhoto } from './InfinitePhotoScroll';
import { useCallback, useMemo, useRef } from 'react';
import useVisibility from '@/utility/useVisibility';
import PhotoDate from './PhotoDate';
import { useAppState } from '@/app/AppState';
import { LuExpand } from 'react-icons/lu';
import LoaderButton from '@/components/primitives/LoaderButton';
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
  shouldShare = true,
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
  shouldShare?: boolean
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
    toggleRecipeOverlay,
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
    <PhotoLink
      photo={photo}
      className={clsx(
        'font-bold grow',
        UPPERCASE_TITLES && 'uppercase',
      )}
      prefetch={prefetch}
    />;

  // Match PhotoLarge matte sizing so portraits occupy ~same space as landscapes
  const matteContentWidthForAspectRatio =
    photo.aspectRatio > 3 / 2 + 0.1
      ? 'w-[90%]'
      : photo.aspectRatio >= 1
        ? 'w-[80%]'
        : undefined;

  const renderLargePhoto =
    <div className={clsx(
      'relative',
      'flex items-center justify-center',
      'h-[90%]',
      matteContentWidthForAspectRatio,
    )}>
      <ZoomControls
        ref={refZoomControls}
        selectImageElement={selectZoomImageElement}
        {...{ isEnabled: showZoomControls, shouldZoomOnFKeydown }}
      >
        <ImageLarge
          className="h-full"
          classNameImage="object-contain w-full h-full"
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

  const renderAdminMenu =
    <AdminPhotoMenu {...{
      photo,
      revalidatePhoto,
      includeFavorite: includeFavoriteInAdminMenu,
      showKeyCommands: showAdminKeyCommands,
    }} />;

  const photoContainerClassName = clsx(
    'flex items-center justify-center aspect-3/2 w-full',
  );

  const metaAlignClass = metaSide === 'left'
    ? 'md:text-right md:items-end'
    : 'md:text-left md:items-start';

  const renderMeta =
    <DivDebugBaselineGrid className={clsx(
      'flex flex-col gap-y-baseline',
      'w-full md:w-48 lg:w-56 shrink-0',
      metaAlignClass,
    )}>
      <div className={clsx(
        'w-full',
        'grid grid-cols-2 md:grid-cols-1',
        'gap-x-0.5 sm:gap-x-1 gap-y-baseline',
      )}>
        <div className={clsx(
          'pr-3 md:pr-0',
          metaSide === 'left' && 'md:flex md:flex-col md:items-end',
        )}>
          {!isEditingTitles &&
            <div className={clsx(
              'float-end hidden md:block',
              metaSide === 'left' && 'float-start',
            )}>
              {renderAdminMenu}
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
            'space-y-baseline',
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
                        contrast="medium"
                        prefetch={prefetchRelatedLinks}
                      />}
                    {showLensContent &&
                      <PhotoLens
                        lens={lens}
                        contrast="medium"
                        prefetch={prefetchRelatedLinks}
                      />}
                  </div>}
                {showRecipeContent && recipeTitle &&
                  <PhotoRecipe
                    ref={refPhotoRecipe}
                    recipe={recipeTitle}
                    contrast="medium"
                    prefetch={prefetchRelatedLinks}
                    toggleRecipeOverlay={toggleRecipeOverlay}
                    isShowingRecipeOverlay={isShowingRecipeOverlay}
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
          'space-y-baseline',
          !hasTitleContent && !hasMetaContent && 'md:-mt-baseline',
          metaSide === 'left' && 'md:flex md:flex-col md:items-end',
        )}>
          {!isEditingTitles &&
            <div className="float-end md:hidden">
              {renderAdminMenu}
            </div>}
          {showExifContent &&
            <>
              <ul className="text-medium">
                <li>
                  {photo.focalLength &&
                    <Link
                      href={pathForFocalLength(photo.focalLength)}
                      className="hover:text-main active:text-medium"
                    >
                      {photo.focalLengthFormatted}
                    </Link>}
                  {(
                    photo.focalLengthIn35MmFormatFormatted &&
                    // eslint-disable-next-line @stylistic/max-len
                    photo.focalLengthIn35MmFormatFormatted !== photo.focalLengthFormatted
                  ) &&
                    <>
                      {' '}
                      <Tooltip
                        content={appText.tooltip['35mm']}
                        sideOffset={3}
                        supportMobile
                      >
                        <span
                          className={clsx(
                            'text-extra-dim',
                            'decoration-dotted underline-offset-[3px]',
                            'hover:underline',
                          )}
                        >
                          {photo.focalLengthIn35MmFormatFormatted}
                        </span>
                      </Tooltip>
                    </>}
                </li>
                <li>{photo.fNumberFormatted}</li>
                <li>{photo.exposureTimeFormatted}</li>
                <li>{photo.isoFormatted}</li>
                {photo.exposureCompensationFormatted
                  ? <li>{photo.exposureCompensationFormatted}</li>
                  : ALWAYS_SHOW_EXPOSURE_COMP && <li>0ev</li>}
              </ul>
              {showFilmContent && photo.film &&
                <PhotoFilm
                  ref={refPhotoFilm}
                  film={photo.film}
                  make={photo.make}
                  prefetch={prefetchRelatedLinks}
                  {...photo.recipeData && !photo.recipeTitle && {
                    toggleRecipeOverlay,
                    isShowingRecipeOverlay,
                  }}
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
          <div className={clsx(
            'flex gap-x-3 gap-y-baseline',
            'md:flex-col flex-wrap',
            'md:justify-normal',
            metaSide === 'left' && 'md:items-end',
          )}>
            <PhotoDate
              photo={photo}
              className={clsx(
                'text-medium',
                !hasNonDateContent && isUserSignedIn && 'md:pr-7',
              )}
              timezone={null}
              hideTime={!SHOW_TAKEN_AT_TIME}
            />
            <div className={clsx(
              'flex gap-1 translate-y-[0.5px]',
              'translate-x-[-2.5px]',
              metaSide === 'left' && 'md:translate-x-[2.5px]',
            )}>
              {showZoomControls &&
                <LoaderButton
                  tooltip={appText.tooltip.zoom}
                  aria-label={appText.tooltip.zoom}
                  icon={<LuExpand size={15} />}
                  onClick={() => refZoomControls.current?.open()}
                  styleAs="link"
                  className="text-medium translate-y-[0.25px]"
                  hideFocusOutline
                />}
              {shouldShare &&
                <ShareButton
                  tooltip={appText.tooltip.sharePhoto}
                  photo={photo}
                  prefetch={prefetchRelatedLinks}
                />}
              {ALLOW_PUBLIC_DOWNLOADS &&
                <DownloadButton
                  className="translate-y-[0.5px] md:translate-y-0"
                  photo={photo}
                />}
            </div>
            {showStorageCheck &&
              <AdminPhotoStorageCheck photo={photo} />}
          </div>
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
        'flex flex-col items-center gap-4',
        'md:flex-row md:justify-center md:gap-8 lg:gap-12',
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
