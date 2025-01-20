'use client';

import {
  Photo,
  PhotoSetCategory,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
} from '.';
import ImageMedium from '@/components/image/ImageMedium';
import { clsx } from 'clsx/lite';
import { pathForPhoto } from '@/site/paths';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/site/config';
import { useRef } from 'react';
import useOnVisible from '@/utility/useOnVisible';
import LinkWithStatus from '@/components/LinkWithStatus';
import Spinner from '@/components/Spinner';

export default function PhotoMedium({
  photo,
  tag,
  camera,
  simulation,
  focal,
  selected,
  priority,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  className,
  onVisible,
}: {
  photo: Photo
  selected?: boolean
  priority?: boolean
  prefetch?: boolean
  className?: string
  onVisible?: () => void
} & PhotoSetCategory) {
  const ref = useRef<HTMLAnchorElement>(null);

  useOnVisible(ref, onVisible);

  return (
    <LinkWithStatus
      ref={ref}
      href={pathForPhoto({ photo, tag, camera, simulation, focal })}
      className={clsx(
        'active:brightness-75',
        selected && 'brightness-50',
        className,
      )}
      prefetch={prefetch}
    >
      {({ isLoading }) =>
        <div>
          {isLoading &&
            <div className={clsx(
              'absolute inset-0 flex items-center justify-center',
              'text-white bg-black/25 backdrop-blur-sm',
              'animate-fade-in',
              'z-10',
            )}>
              <Spinner size={20} color="text" />
            </div>}
          <ImageMedium
            src={photo.url}
            aspectRatio={photo.aspectRatio}
            blurDataURL={photo.blurData}
            blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
            className="flex object-cover w-full h-full "
            imgClassName="object-cover w-full h-full"
            alt={altTextForPhoto(photo)}
            priority={priority}
          />
        </div>}
    </LinkWithStatus>
  );
};
