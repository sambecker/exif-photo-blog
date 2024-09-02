'use client';

import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
  shouldShowCameraDataForPhoto,
  shouldShowExifDataForPhoto,
  titleForPhoto,
} from '.';
import SiteGrid from '@/components/SiteGrid';
import ImageLarge from '@/components/image/ImageLarge';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import {
  pathForFocalLength,
  pathForPhoto,
  pathForPhotoShare,
} from '@/site/paths';
import PhotoTags from '@/tag/PhotoTags';
import ShareButton from '@/components/ShareButton';
import PhotoCamera from '../camera/PhotoCamera';
import { cameraFromPhoto } from '@/camera';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import { sortTags } from '@/tag';
import DivDebugBaselineGrid from '@/components/DivDebugBaselineGrid';
import PhotoLink from './PhotoLink';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/site/config';
import AdminPhotoMenuClient from '@/admin/AdminPhotoMenuClient';
import { RevalidatePhoto } from './InfinitePhotoScroll';
import { useRef } from 'react';
import useOnVisible from '@/utility/useOnVisible';
import PhotoDate from './PhotoDate';
import { useAppState } from '@/state/AppState';

export default function PhotoLarge({
  photo,
  className,
  primaryTag,
  priority,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  prefetchRelatedLinks = SHOULD_PREFETCH_ALL_LINKS,
  revalidatePhoto,
  showTitle = true,
  showCamera = true,
  showSimulation = true,
  shouldShare = true,
  shouldShareTag,
  shouldShareCamera,
  shouldShareSimulation,
  shouldShareFocalLength,
  shouldScrollOnShare,
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
  showCamera?: boolean
  showSimulation?: boolean
  shouldShare?: boolean
  shouldShareTag?: boolean
  shouldShareCamera?: boolean
  shouldShareSimulation?: boolean
  shouldShareFocalLength?: boolean
  shouldScrollOnShare?: boolean
  includeFavoriteInAdminMenu?: boolean
  onVisible?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null);

  const tags = sortTags(photo.tags, primaryTag);

  const camera = cameraFromPhoto(photo);

  const showCameraContent = showCamera && shouldShowCameraDataForPhoto(photo);
  const showTagsContent = tags.length > 0;
  const showExifContent = shouldShowExifDataForPhoto(photo);

  useOnVisible(ref, onVisible);

  const { arePhotosMatted, isUserSignedIn } = useAppState();

  const hasTitle =
    showTitle &&
    Boolean(photo.title);

  const hasTitleContent =
    hasTitle ||
    Boolean(photo.caption);

  const hasMetaContent =
    showCameraContent ||
    showTagsContent ||
    showExifContent;

  const hasNonDateContent =
    hasTitleContent ||
    hasMetaContent;

  return (
    <SiteGrid
      containerRef={ref}
      className={className}
      contentMain={
        <Link
          href={pathForPhoto({ photo })}
          className={clsx(arePhotosMatted &&
            'flex items-center aspect-[3/2] bg-gray-100',
          )}
          prefetch={prefetch}
        >
          <div className={clsx(
            arePhotosMatted &&
              'flex items-center justify-center w-full',
            arePhotosMatted && photo.aspectRatio >= 1
              ? 'h-[80%]'
              : 'h-[90%]',
          )}>
            <ImageLarge
              className={clsx(arePhotosMatted && 'h-full')}
              imgClassName={clsx(arePhotosMatted &&
                'object-contain w-full h-full')}
              alt={altTextForPhoto(photo)}
              src={photo.url}
              aspectRatio={photo.aspectRatio}
              blurDataURL={photo.blurData}
              blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
              priority={priority}
            />
          </div>
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
              {hasTitle &&
                <PhotoLink
                  photo={photo}
                  className="font-bold uppercase flex-grow"
                  prefetch={prefetch}
                />}
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
              {(showCameraContent || showTagsContent) &&
                <div>
                  {showCameraContent &&
                    <PhotoCamera
                      camera={camera}
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
            !hasTitleContent && 'md:-mt-baseline',
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
                    {photo.focalLengthIn35MmFormatFormatted &&
                      <>
                        {' '}
                        <span
                          title="35mm equivalent"
                          className="text-extra-dim"
                        >
                          {photo.focalLengthIn35MmFormatFormatted}
                        </span>
                      </>}
                  </li>
                  <li>{photo.fNumberFormatted}</li>
                  <li>{photo.exposureTimeFormatted}</li>
                  <li>{photo.isoFormatted}</li>
                  <li>{photo.exposureCompensationFormatted ?? '0ev'}</li>
                </ul>
                {showSimulation && photo.filmSimulation &&
                  <PhotoFilmSimulation
                    simulation={photo.filmSimulation}
                    prefetch={prefetchRelatedLinks}
                  />}
              </>}
            <div className={clsx(
              'flex gap-x-2 gap-y-baseline',
              'md:flex-col md:justify-normal',
            )}>
              <PhotoDate
                photo={photo}
                className={clsx(
                  'text-medium',
                  // Prevent collision with admin button
                  !hasNonDateContent && isUserSignedIn && 'md:pr-7',
                )}
              />
              {shouldShare &&
                <ShareButton
                  className={clsx(
                    'md:translate-x-[-2.5px]',
                    'translate-y-[1.5px] md:translate-y-0',
                  )}
                  path={pathForPhotoShare({
                    photo,
                    tag: shouldShareTag ? primaryTag : undefined,
                    camera: shouldShareCamera ? camera : undefined,
                    // eslint-disable-next-line max-len
                    simulation: shouldShareSimulation ? photo.filmSimulation : undefined,
                    // eslint-disable-next-line max-len
                    focal: shouldShareFocalLength ? photo.focalLength : undefined,
                  })}
                  prefetch={prefetchRelatedLinks}
                  shouldScroll={shouldScrollOnShare}
                />}
            </div>
          </div>
        </DivDebugBaselineGrid>}
    />
  );
};
