import {
  Photo,
  altTextForPhoto,
  shouldShowCameraDataForPhoto,
  shouldShowExifDataForPhoto,
  titleForPhoto,
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
import AdminPhotoMenu from '@/admin/AdminPhotoMenu';
import { Suspense } from 'react';

export default function PhotoLarge({
  photo,
  primaryTag,
  priority,
  prefetchShare,
  showCamera = true,
  showSimulation = true,
  shouldShareTag,
  shouldShareCamera,
  shouldShareSimulation,
  shouldScrollOnShare,
}: {
  photo: Photo
  primaryTag?: string
  priority?: boolean
  prefetchShare?: boolean
  showCamera?: boolean
  showSimulation?: boolean
  shouldShareTag?: boolean
  shouldShareCamera?: boolean
  shouldShareSimulation?: boolean
  shouldScrollOnShare?: boolean
}) {
  const tags = sortTags(photo.tags, primaryTag);

  const camera = cameraFromPhoto(photo);

  const showCameraContent = showCamera && shouldShowCameraDataForPhoto(photo);
  const showTagsContent = tags.length > 0;
  const showExifContent = shouldShowExifDataForPhoto(photo);

  return (
    <SiteGrid
      contentMain={
        <ImageLarge
          className="w-full"
          alt={altTextForPhoto(photo)}
          href={pathForPhoto(photo, primaryTag)}
          src={photo.url}
          aspectRatio={photo.aspectRatio}
          blurData={photo.blurData}
          priority={priority}
        />}
      contentSide={
        <div className={clsx(
          'relative',
          'leading-snug',
          'sticky top-4 self-start -translate-y-1',
          'grid grid-cols-2 md:grid-cols-1',
          'gap-x-0.5 sm:gap-x-1 gap-y-4',
          'pb-6',
        )}>
          {/* Meta */}
          <div className="pr-3 md:pr-0">
            <div className="md:relative flex gap-2 items-start">
              <div className="flex-grow">
                <Link
                  href={pathForPhoto(photo)}
                  className="font-bold uppercase"
                >
                  {titleForPhoto(photo)}
                </Link>
              </div>
              <Suspense>
                <div className="absolute right-0 translate-y-[-4px] z-10">
                  <AdminPhotoMenu photo={photo} />
                </div>
              </Suspense>
            </div>
            <div className="space-y-4">
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
                    />}
                  {showTagsContent &&
                    <PhotoTags tags={tags} contrast="medium" />}
                </div>}
            </div>
          </div>
          {/* EXIF Data */}
          <div className="space-y-4">
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
                  />}
              </>}
            <div className={clsx(
              'flex gap-2',
              'md:flex-col md:gap-4 md:justify-normal',
            )}>
              <div className={clsx(
                'text-medium uppercase pr-1',
              )}>
                {photo.takenAtNaiveFormatted}
              </div>
              <ShareButton
                path={pathForPhotoShare(
                  photo,
                  shouldShareTag ? primaryTag : undefined,
                  shouldShareCamera ? camera : undefined,
                  shouldShareSimulation ? photo.filmSimulation : undefined,
                )}
                prefetch={prefetchShare}
                shouldScroll={shouldScrollOnShare}
              />
            </div>
          </div>
        </div>}
    />
  );
};
