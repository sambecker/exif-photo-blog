'use client';

import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
  shouldShowCameraDataForPhoto,
  shouldShowExifDataForPhoto,
} from '.';
import SiteGrid from '@/components/SiteGrid';
import ImageLarge from '@/components/ImageLarge';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { pathForPhoto, pathForPhotoShare } from '@/site/paths';
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

export default function PhotoLarge({
  photo,
  primaryTag,
  priority,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  prefetchRelatedLinks = SHOULD_PREFETCH_ALL_LINKS,
  revalidatePhoto,
  showCamera = true,
  showSimulation = true,
  shouldShareTag,
  shouldShareCamera,
  shouldShareSimulation,
  shouldScrollOnShare,
  onVisible,
}: {
  photo: Photo
  primaryTag?: string
  priority?: boolean
  prefetch?: boolean
  prefetchRelatedLinks?: boolean
  revalidatePhoto?: RevalidatePhoto
  showCamera?: boolean
  showSimulation?: boolean
  shouldShareTag?: boolean
  shouldShareCamera?: boolean
  shouldShareSimulation?: boolean
  shouldScrollOnShare?: boolean
  onVisible?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null);

  const tags = sortTags(photo.tags, primaryTag);

  const camera = cameraFromPhoto(photo);

  const showCameraContent = showCamera && shouldShowCameraDataForPhoto(photo);
  const showTagsContent = tags.length > 0;
  const showExifContent = shouldShowExifDataForPhoto(photo);

  useOnVisible(ref, onVisible);

  return (
    <SiteGrid
      containerRef={ref}
      contentMain={
        <Link
          href={pathForPhoto(photo)}
          className="active:brightness-75"
          prefetch={prefetch}
        >
          <ImageLarge
            className="w-full"
            alt={altTextForPhoto(photo)}
            src={photo.url}
            aspectRatio={photo.aspectRatio}
            blurData={photo.blurData}
            blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
            priority={priority}
          />
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
              <PhotoLink
                photo={photo}
                className="font-bold uppercase flex-grow"
                prefetch={prefetch}
              />
              <div className="absolute right-0 translate-y-[-4px] z-10">
                <AdminPhotoMenuClient {...{
                  photo,
                  revalidatePhoto,
                }} />
              </div>
            </div>
            <div className="space-y-baseline">
              {photo.caption &&
                <div className="uppercase">
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
          <div className="space-y-baseline">
            {showExifContent &&
              <>
                <ul className="text-medium">
                  <li>
                    {photo.focalLengthFormatted}
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
              'flex gap-x-1.5 gap-y-baseline',
              'md:flex-col md:justify-normal',
            )}>
              <div className={clsx(
                'text-medium uppercase pr-1',
              )}>
                {photo.takenAtNaiveFormatted}
              </div>
              <ShareButton
                className={clsx(
                  'md:translate-x-[-2.5px]',
                  'translate-y-[1.5px] md:translate-y-0',
                )}
                path={pathForPhotoShare(
                  photo,
                  shouldShareTag ? primaryTag : undefined,
                  shouldShareCamera ? camera : undefined,
                  shouldShareSimulation ? photo.filmSimulation : undefined,
                )}
                prefetch={prefetchRelatedLinks}
                shouldScroll={shouldScrollOnShare}
              />
            </div>
          </div>
        </DivDebugBaselineGrid>}
    />
  );
};
