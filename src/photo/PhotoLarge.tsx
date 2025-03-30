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
  titleForPhoto,
} from '.';
import AppGrid from '@/components/AppGrid';
import ImageLarge from '@/components/image/ImageLarge';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { pathForFocalLength, pathForPhoto } from '@/app/paths';
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
  MATTE_COLOR,
  MATTE_COLOR_DARK,
} from '@/app/config';
import AdminPhotoMenu from '@/admin/AdminPhotoMenu';
import { RevalidatePhoto } from './InfinitePhotoScroll';
import { useMemo, useRef } from 'react';
import useVisible from '@/utility/useVisible';
import PhotoDate from './PhotoDate';
import { useAppState } from '@/state/AppState';
import { LuExpand } from 'react-icons/lu';
import LoaderButton from '@/components/primitives/LoaderButton';
import Tooltip from '@/components/Tooltip';
import ZoomControls, { ZoomControlsRef } from '@/components/image/ZoomControls';
import { TbChecklist } from 'react-icons/tb';
import { IoCloseSharp } from 'react-icons/io5';
import { AnimatePresence } from 'framer-motion';
import useRecipeOverlay from '../recipe/useRecipeOverlay';
import PhotoRecipeOverlay from '@/recipe/PhotoRecipeOverlay';
import PhotoRecipe from '@/recipe/PhotoRecipe';
import PhotoLens from '@/lens/PhotoLens';
import { lensFromPhoto } from '@/lens';
import MaskedScroll from '@/components/MaskedScroll';
import useCategoryCountsForPhoto from '@/category/useCategoryCountsForPhoto';

export default function PhotoLarge({
  photo,
  className,
  primaryTag,
  priority,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  prefetchRelatedLinks = SHOULD_PREFETCH_ALL_LINKS,
  revalidatePhoto,
  showTitle = true,
  showTitleAsH1,
  showCamera = true,
  showLens = true,
  showFilm = true,
  showRecipe = true,
  showZoomControls: showZoomControlsProp = true,
  shouldZoomOnFKeydown = true,
  shouldShare = true,
  shouldShareCamera,
  shouldShareLens,
  shouldShareTag,
  shouldShareFilm,
  shouldShareRecipe,
  shouldShareFocalLength,
  includeFavoriteInAdminMenu,
  onVisible,
}: {
  photo: Photo
  className?: string
  primaryTag?: string
  priority?: boolean
  prefetch?: boolean
  prefetchRelatedLinks?: boolean
  revalidatePhoto?: RevalidatePhoto
  showTitle?: boolean
  showTitleAsH1?: boolean
  showCamera?: boolean
  showLens?: boolean
  showFilm?: boolean
  showRecipe?: boolean
  showZoomControls?: boolean
  shouldZoomOnFKeydown?: boolean
  shouldShare?: boolean
  shouldShareCamera?: boolean
  shouldShareLens?: boolean
  shouldShareTag?: boolean
  shouldShareFilm?: boolean
  shouldShareRecipe?: boolean
  shouldShareFocalLength?: boolean
  includeFavoriteInAdminMenu?: boolean
  onVisible?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null);

  const zoomControlsRef = useRef<ZoomControlsRef>(null);

  const {
    areZoomControlsShown,
    arePhotosMatted,
    shouldDebugRecipeOverlays,
    isUserSignedIn,
  } = useAppState();

  const {
    cameraCount,
    lensCount,
    tagCounts,
    recipeCount,
    filmCount,
  } = useCategoryCountsForPhoto(photo);

  const showZoomControls = showZoomControlsProp && areZoomControlsShown;

  const refRecipe = useRef<HTMLDivElement>(null);
  const refRecipeButton = useRef<HTMLButtonElement>(null);
  const refTriggers = useMemo(() => [refRecipeButton], []);
  const {
    shouldShowRecipeOverlay,
    toggleRecipeOverlay,
    hideRecipeOverlay,
  } = useRecipeOverlay({
    ref: refRecipe,
    refTriggers,
  });

  const tags = sortTagsArray(photo.tags, primaryTag);

  const camera = cameraFromPhoto(photo);
  const lens = lensFromPhoto(photo);
  const { recipeTitle } = photo;

  const showExifContent = shouldShowExifDataForPhoto(photo);

  const showCameraContent = showCamera && shouldShowCameraDataForPhoto(photo);
  const showLensContent = showLens && shouldShowLensDataForPhoto(photo);
  const showTagsContent = tags.length > 0;
  const showRecipeContent = showRecipe && shouldShowRecipeDataForPhoto(photo);
  const showRecipeButton = shouldShowRecipeDataForPhoto(photo);
  const showFilmContent = showFilm && shouldShowFilmDataForPhoto(photo);

  useVisible({ ref, onVisible });

  const hasTitle =
    showTitle &&
    Boolean(photo.title);

  const hasTitleContent =
    hasTitle ||
    Boolean(photo.caption);

  const hasMetaContent =
    showCameraContent ||
    showLensContent ||
    showTagsContent ||
    showRecipeContent ||
    showFilmContent ||
    showExifContent;

  const hasNonDateContent =
    hasTitleContent ||
    hasMetaContent;

  const renderPhotoLink =
    <PhotoLink
      photo={photo}
      className="font-bold uppercase grow"
      prefetch={prefetch}
    />;

  // Restrict width for landscape photos
  // (portrait photos are always height restricted)
  const matteContentWidthForAspectRatio =
    photo.aspectRatio > 3 / 2 + 0.1
      ? 'w-[90%]'
      : photo.aspectRatio >= 1
        ? 'w-[80%]'
        : undefined;

  const renderLargePhoto =
    <div className={clsx(
      'relative',
      arePhotosMatted && 'flex items-center justify-center',
      // Always specify height to ensure fallback doesn't collapse
      arePhotosMatted && 'h-[90%]',
      arePhotosMatted && matteContentWidthForAspectRatio,
    )}>
      <ZoomControls
        ref={zoomControlsRef}
        {...{ isEnabled: showZoomControls, shouldZoomOnFKeydown }}
      >
        <ImageLarge
          className={clsx(arePhotosMatted && 'h-full')}
          classNameImage={clsx(arePhotosMatted &&
            'object-contain w-full h-full')}
          alt={altTextForPhoto(photo)}
          src={photo.url}
          aspectRatio={photo.aspectRatio}
          blurDataURL={photo.blurData}
          blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
          priority={priority}
        />
      </ZoomControls>
      <div className={clsx(
        'absolute inset-0',
        'flex items-center justify-center',
        // Allow clicks to pass through to zoom controls
        // when not showing recipe overlay
        !(shouldShowRecipeOverlay || shouldDebugRecipeOverlays) &&
          'pointer-events-none',
      )}>
        <AnimatePresence>
          {(shouldShowRecipeOverlay || shouldDebugRecipeOverlays) &&
            photo.recipeData &&
            photo.film &&
              <PhotoRecipeOverlay
                ref={refRecipe}
                title={photo.recipeTitle}
                recipe={photo.recipeData}
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
      ariaLabel: `Admin menu for '${titleForPhoto(photo)}' photo`,
    }} />;

  const largePhotoContainerClassName = clsx(
    arePhotosMatted && 'flex items-center justify-center aspect-3/2',
    // Matte theme colors defined in root layout
    arePhotosMatted && (MATTE_COLOR
      ? 'bg-(--matte-bg)'
      : 'bg-gray-100'),
    arePhotosMatted && (MATTE_COLOR_DARK
      ? 'dark:bg-(--matte-bg-dark)'
      // Only specify dark background when MATTE_COLOR is not configured
      : !MATTE_COLOR && 'dark:bg-gray-700/30'),
  );

  return (
    <AppGrid
      containerRef={ref}
      className={className}
      contentMain={showZoomControls
        ? <div className={largePhotoContainerClassName}>
          {renderLargePhoto}
        </div>
        : <Link
          href={pathForPhoto({ photo })}
          className={largePhotoContainerClassName}
          prefetch={prefetch}
        >
          {renderLargePhoto}
        </Link>}
      classNameSide="relative"
      contentSide={
        <div className="md:absolute inset-0 -mt-1">
          <MaskedScroll
            className="sticky top-4 self-start"
            fadeHeight={36}
            hideScrollbar
          >
            <DivDebugBaselineGrid className={clsx(
              'grid grid-cols-2 md:grid-cols-1',
              'gap-x-0.5 sm:gap-x-1 gap-y-baseline',
              'mb-6 md:mb-4',
            )}>
              {/* Meta */}
              <div className="pr-3 md:pr-0">
                <div className="float-end hidden md:block">
                  {renderAdminMenu}
                </div>
                {hasTitle && (showTitleAsH1
                  ? <h1>{renderPhotoLink}</h1>
                  : renderPhotoLink)}
                <div className="space-y-baseline">
                  {photo.caption &&
                    <div className="uppercase">
                      {photo.caption}
                    </div>}
                  {(
                    showCameraContent ||
                    showLensContent ||
                    showRecipeContent ||
                    showTagsContent
                  ) &&
                    <div>
                      {(showCameraContent || showLensContent) &&
                        <div className="flex flex-col">
                          {showCameraContent &&
                            <PhotoCamera
                              camera={camera}
                              contrast="medium"
                              prefetch={prefetchRelatedLinks}
                              countOnHover={cameraCount}
                            />}
                          {showLensContent &&
                            <PhotoLens
                              lens={lens}
                              contrast="medium"
                              prefetch={prefetchRelatedLinks}
                              shortText
                              countOnHover={lensCount}
                            />}
                        </div>}
                      {showRecipeContent && recipeTitle &&
                        <PhotoRecipe
                          recipe={recipeTitle}
                          contrast="medium"
                          prefetch={prefetchRelatedLinks}
                          countOnHover={recipeCount}
                        />}
                      {showTagsContent &&
                        <PhotoTags
                          tags={tags}
                          tagCounts={tagCounts}
                          contrast="medium"
                          prefetch={prefetchRelatedLinks}
                        />}
                    </div>}
                </div>
              </div>
              {/* EXIF Data */}
              <div className={clsx(
                'space-y-baseline',
                !hasTitleContent && !hasMetaContent && 'md:-mt-baseline',
              )}>
                <div className="float-end md:hidden">
                  {renderAdminMenu}
                </div>
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
                          // eslint-disable-next-line max-len
                          photo.focalLengthIn35MmFormatFormatted !== photo.focalLengthFormatted
                        ) &&
                          <>
                            {' '}
                            <Tooltip
                              content="35mm equivalent"
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
                      <li>{photo.exposureCompensationFormatted ?? '0ev'}</li>
                    </ul>
                    {(showRecipeButton || showFilmContent) &&
                      <div className="flex items-center gap-2 *:w-auto">
                        {showFilmContent && photo.film &&
                          <PhotoFilm
                            film={photo.film}
                            prefetch={prefetchRelatedLinks}
                            countOnHover={filmCount}
                          />}
                        {showRecipeButton &&
                          <Tooltip content="Fujifilm Recipe">
                            <button
                              ref={refRecipeButton}
                              title="Fujifilm Recipe"
                              onClick={() => {
                                toggleRecipeOverlay();
                                // Avoid unexpected tooltip trigger
                                refRecipeButton.current?.blur();
                              }}
                              className={clsx(
                                'text-medium',
                                'border-medium rounded-md',
                                'px-[4px] py-[2.5px] my-[-3px]',
                                'translate-y-[2px]',
                                'hover:bg-dim active:bg-main',
                                !showFilm && 'translate-x-[-2px]',
                              )}>
                              {shouldShowRecipeOverlay
                                ? <IoCloseSharp size={15} />
                                : <TbChecklist
                                  className="translate-x-[0.5px]"
                                  size={15}
                                />}
                            </button>
                          </Tooltip>} 
                      </div>}
                  </>}
                <div className={clsx(
                  'flex gap-x-3 gap-y-baseline',
                  'md:flex-col flex-wrap',
                  'md:justify-normal',
                )}>
                  <PhotoDate
                    photo={photo}
                    className={clsx(
                      'text-medium',
                      // Prevent collision with admin button
                      !hasNonDateContent && isUserSignedIn && 'md:pr-7',
                    )}
                    // 'createdAt' is a naive datetime which does not require
                    // a timezone and will not cause server/client mismatch
                    timezone={null}
                    hideTime={!SHOW_TAKEN_AT_TIME}
                  />
                  <div className={clsx(
                    'flex gap-1 translate-y-[0.5px]',
                    'translate-x-[-2.5px]',
                  )}>
                    {showZoomControls &&
                      <LoaderButton
                        title="Open Image Viewer"
                        icon={<LuExpand size={15} />}
                        onClick={() => zoomControlsRef.current?.open()}
                        styleAs="link"
                        className="text-medium translate-y-[0.25px]"
                        hideFocusOutline
                      />}
                    {shouldShare &&
                      <ShareButton
                        title="Share Photo"
                        photo={photo}
                        tag={shouldShareTag ? primaryTag : undefined}
                        camera={shouldShareCamera ? camera : undefined}
                        lens={shouldShareLens ? lens : undefined}
                        film={shouldShareFilm
                          ? photo.film
                          : undefined}
                        recipe={shouldShareRecipe
                          ? recipeTitle
                          : undefined}
                        focal={shouldShareFocalLength
                          ? photo.focalLength
                          : undefined}
                        prefetch={prefetchRelatedLinks}
                      />}
                    {ALLOW_PUBLIC_DOWNLOADS && 
                      <DownloadButton 
                        className="translate-y-[0.5px] md:translate-y-0"
                        photo={photo} 
                      />}
                  </div>
                </div>
              </div>
            </DivDebugBaselineGrid>
          </MaskedScroll>
        </div>}
    />
  );
};
