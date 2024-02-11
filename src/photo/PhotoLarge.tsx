import {
  Photo,
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
  
  const renderMiniGrid = (children: JSX.Element, rightPadding = true) =>
    <div className={clsx(
      'flex gap-y-4',
      'flex-col sm:flex-row md:flex-col',
      '[&>*]:sm:flex-grow',
      rightPadding && 'pr-2',
    )}>
      {children}
    </div>;

  return (
    <SiteGrid
      contentMain={
        <ImageLarge
          className="w-full"
          alt={titleForPhoto(photo)}
          href={pathForPhoto(photo, primaryTag)}
          src={photo.url}
          aspectRatio={photo.aspectRatio}
          blurData={photo.blurData}
          priority={priority}
        />}
      contentSide={
        <div className={clsx(
          'leading-snug',
          'sticky top-4 self-start',
          'grid grid-cols-2 md:grid-cols-1',
          'gap-x-0.5 sm:gap-x-1',
          'gap-y-4',
          '-translate-y-1',
          'mb-4',
        )}>
          {renderMiniGrid(<>
            <div className="-space-y-0.5">
              <div className="relative flex gap-2 items-start">
                <div className="md:flex-grow">
                  <Link
                    href={pathForPhoto(photo)}
                    className="font-bold uppercase"
                  >
                    {titleForPhoto(photo)}
                  </Link>
                </div>
                <Suspense>
                  <div className="h-4 translate-y-[-3.5px] z-10">
                    <AdminPhotoMenu photo={photo} />
                  </div>
                </Suspense>
              </div>
              {tags.length > 0 &&
                <PhotoTags tags={tags} />}
            </div>
            {showCamera && shouldShowCameraDataForPhoto(photo) &&
              <div className="space-y-0.5">
                <PhotoCamera
                  camera={camera}
                  type="text-only"
                />
                {showSimulation && photo.filmSimulation &&
                  <div className="translate-x-[-0.3rem]"> 
                    <PhotoFilmSimulation
                      simulation={photo.filmSimulation}
                    />
                  </div>}
              </div>}
          </>)}
          {renderMiniGrid(<>
            {shouldShowExifDataForPhoto(photo) &&
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
                <li>{photo.exposureCompensationFormatted ?? '—'}</li>
              </ul>}
            <div className={clsx(
              'flex gap-y-4',
              'flex-col sm:flex-row md:flex-col',
            )}>
              <div className={clsx(
                'grow uppercase',
                'text-medium',
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
          </>, false)}
        </div>}
    />
  );
};
