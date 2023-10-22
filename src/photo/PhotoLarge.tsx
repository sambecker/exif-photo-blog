import { Photo, photoHasCameraData, photoHasExifData, titleForPhoto } from '.';
import SiteGrid from '@/components/SiteGrid';
import ImageLarge from '@/components/ImageLarge';
import { cc } from '@/utility/css';
import Link from 'next/link';
import { pathForPhoto, pathForPhotoShare } from '@/site/paths';
import PhotoTags from '@/tag/PhotoTags';
import ShareButton from '@/components/ShareButton';
import PhotoCamera from '../camera/PhotoCamera';
import { Camera, cameraFromPhoto } from '@/camera';

export default function PhotoLarge({
  photo,
  tag,
  priority,
  prefetchShare,
  shouldScrollOnShare,
  showCamera = true,
  shareCamera,
}: {
  photo: Photo
  tag?: string
  camera?: Camera
  priority?: boolean
  prefetchShare?: boolean
  shouldScrollOnShare?: boolean
  showCamera?: boolean
  shareCamera?: boolean
}) {
  const tagsToShow = photo.tags.filter(t => t !== tag);

  const camera = cameraFromPhoto(photo);
  
  const renderMiniGrid = (children: JSX.Element, rightPadding = true) =>
    <div className={cc(
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
          href={pathForPhoto(photo, tag)}
          src={photo.url}
          aspectRatio={photo.aspectRatio}
          blurData={photo.blurData}
          priority={priority}
        />}
      contentSide={
        <div className={cc(
          'sticky top-4 self-start',
          'grid grid-cols-2 md:grid-cols-1',
          'gap-y-4',
          '-translate-y-1',
          'mb-4',
        )}>
          {renderMiniGrid(<>
            <div>
              <Link
                href={pathForPhoto(photo)}
                className="font-bold uppercase"
              >
                {titleForPhoto(photo)}
              </Link>
              {tagsToShow.length > 0 &&
                <PhotoTags tags={tagsToShow} />}
            </div>
            {showCamera && photoHasCameraData(photo) &&
              <PhotoCamera
                camera={camera}
                showIcon={false}
                hideApple={false}
              />}
          </>)}
          {renderMiniGrid(<>
            {photoHasExifData(photo) &&
              <ul className={cc(
                'text-gray-500',
                'dark:text-gray-400',
              )}>
                <li>
                  {photo.focalLengthFormatted}
                  {photo.focalLengthIn35MmFormatFormatted &&
                    <>
                      {' '}
                      <span
                        className={cc(
                          'text-gray-400/80',
                          'dark:text-gray-400/50',
                        )}
                        title="35mm equivalent"
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
            <div className={cc(
              'flex gap-y-4',
              'flex-col sm:flex-row md:flex-col',
            )}>
              <div className={cc(
                'grow uppercase',
                'text-gray-500',
                'dark:text-gray-400',
              )}>
                {photo.takenAtNaiveFormatted}
              </div>
              <ShareButton
                path={pathForPhotoShare(
                  photo,
                  tag,
                  shareCamera ? camera : undefined,
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
