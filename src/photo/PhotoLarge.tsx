'use client';

import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
  shouldShowCameraDataForPhoto,
  shouldShowExifDataForPhoto,
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
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import { sortTags } from '@/tag';
import DivDebugBaselineGrid from '@/components/DivDebugBaselineGrid';
import PhotoLink from './PhotoLink';
import {
  SHOULD_PREFETCH_ALL_LINKS,
  ALLOW_PUBLIC_DOWNLOADS,
  SHOW_TAKEN_AT_TIME,
} from '@/app/config';
import AdminPhotoMenuClient from '@/admin/AdminPhotoMenuClient';
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
  showSimulation = true,
  showRecipe = true,
  showZoomControls: showZoomControlsProp = true,
  shouldZoomOnFKeydown = true,
  shouldShare = true,
  shouldShareCamera,
  shouldShareLens,
  shouldShareTag,
  shouldShareSimulation,
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
  showSimulation?: boolean
  showRecipe?: boolean
  showZoomControls?: boolean
  shouldZoomOnFKeydown?: boolean
  shouldShare?: boolean
  shouldShareCamera?: boolean
  shouldShareLens?: boolean
  shouldShareTag?: boolean
  shouldShareSimulation?: boolean
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

  const tags = sortTags(photo.tags, primaryTag);

  const camera = cameraFromPhoto(photo);
  const lens = lensFromPhoto(photo);
  const { recipeTitle } = photo;

  const showExifContent = shouldShowExifDataForPhoto(photo);

  const showCameraContent = showCamera && shouldShowCameraDataForPhoto(photo);
  const showLensContent = showLens && shouldShowLensDataForPhoto(photo);
  const showRecipeContent = showRecipe && shouldShowRecipeDataForPhoto(photo);
  const showRecipeButton = shouldShowRecipeDataForPhoto(photo);
  const showTagsContent = tags.length > 0;

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

  const largePhotoContent =
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
            photo.filmSimulation &&
              <PhotoRecipeOverlay
                ref={refRecipe}
                title={photo.recipeTitle}
                recipe={photo.recipeData}
                simulation={photo.filmSimulation}
                iso={photo.isoFormatted}
                exposure={photo.exposureCompensationFormatted}
                onClose={hideRecipeOverlay}
              />}
        </AnimatePresence>
      </div>
    </div>;

  const largePhotoContainerClassName = clsx(arePhotosMatted &&
    'flex items-center justify-center aspect-3/2 bg-gray-100',
  );

  return (
    <AppGrid
      containerRef={ref}
      className={className}
      contentMain={showZoomControls
        ? <div className={largePhotoContainerClassName}>
          {largePhotoContent}
        </div>
        : <Link
          href={pathForPhoto({ photo })}
          className={largePhotoContainerClassName}
          prefetch={prefetch}
        >
          {largePhotoContent}
        </Link>}
      contentSide={
        <DivDebugBaselineGrid className={clsx(
          'relative',
          'sticky top-4 self-start -translate-y-1',
          'grid grid-cols-2 md:grid-cols-1',
          'gap-x-0.5 sm:gap-x-1 gap-y-baseline',
          'pb-6',
        )}>
          {/* Meta */}
          <div className="pr-2 md:pr-0">
            <div className="md:relative flex gap-2 items-start">
              {hasTitle && (showTitleAsH1
                ? <h1>{renderPhotoLink}</h1>
                : renderPhotoLink)}
              <div className="absolute right-0 translate-y-[-4px] z-10">
                <AdminPhotoMenuClient {...{
                  photo,
                  revalidatePhoto,
                  includeFavorite: includeFavoriteInAdminMenu,
                  ariaLabel: `Admin menu for '${titleForPhoto(photo)}' photo`,
                }} />
              </div>
            </div>
            <div className="space-y-baseline">
              {photo.caption &&
                <div className={clsx(
                  'uppercase', 
                  // Prevent collision with admin button
                  isUserSignedIn && 'md:pr-7',
                )}>
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
                        />}
                      {showLensContent &&
                        <PhotoLens
                          lens={lens}
                          contrast="medium"
                          prefetch={prefetchRelatedLinks}
                          shortText
                        />}
                    </div>}
                  {showRecipeContent && recipeTitle &&
                    <PhotoRecipe
                      recipe={recipeTitle}
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
          {/* EXIF Data */}
          <div className={clsx(
            'space-y-baseline',
            !hasTitleContent && !hasMetaContent && 'md:-mt-baseline',
          )}>
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
                {(showSimulation || showRecipeButton) &&
                  <div className="flex items-center gap-2 *:w-auto">
                    {showSimulation && photo.filmSimulation &&
                      <PhotoFilmSimulation
                        simulation={photo.filmSimulation}
                        prefetch={prefetchRelatedLinks}
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
                            !showSimulation && 'translate-x-[-2px]',
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
                    simulation={shouldShareSimulation
                      ? photo.filmSimulation
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
        </DivDebugBaselineGrid>}
    />
  );
};
