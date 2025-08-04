'use client';

import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
} from '.';
import { PhotoSetCategory } from '../category';
import ImageMedium from '@/components/image/ImageMedium';
import { clsx } from 'clsx/lite';
import { pathForPhoto } from '@/app/path';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/app/config';
import { useRef } from 'react';
import useVisible from '@/utility/useVisible';
import LinkWithStatus from '@/components/LinkWithStatus';
import Spinner from '@/components/Spinner';
import PhotoColors from './color/PhotoColors';

export default function PhotoMedium({
  photo,
  selected,
  priority,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  className,
  onVisible,
  debugColor,
  ...categories
}: {
  photo: Photo
  selected?: boolean
  priority?: boolean
  prefetch?: boolean
  className?: string
  onVisible?: () => void
  debugColor?: boolean
} & PhotoSetCategory) {
  const ref = useRef<HTMLAnchorElement>(null);

  useVisible({ ref, onVisible });

  return (
    <LinkWithStatus
      ref={ref}
      href={pathForPhoto({ photo, ...categories })}
      className={clsx(
        'group',
        'active:brightness-75',
        selected && 'brightness-50',
        className,
      )}
      prefetch={prefetch}
    >
      {({ isLoading }) =>
        <div className="w-full h-full">
          {isLoading &&
            <div className={clsx(
              'absolute inset-0 flex items-center justify-center',
              'text-white bg-black/25 backdrop-blur-xs',
              'animate-fade-in',
              'z-10',
            )}>
              <Spinner size={20} color="text" />
            </div>}
          {debugColor && photo.colorData &&
            <div className={clsx(
              'absolute inset-2 z-10',
              'opacity-0 group-hover:opacity-100 transition-opacity',
            )}>
              <PhotoColors
                className="justify-end"
                colorData={photo.colorData}
              />
            </div>}
          <ImageMedium
            src={photo.url}
            aspectRatio={photo.aspectRatio}
            blurDataURL={photo.blurData}
            blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
            className="flex object-cover w-full h-full"
            classNameImage="object-cover w-full h-full"
            alt={altTextForPhoto(photo)}
            priority={priority}
          />
        </div>}
    </LinkWithStatus>
  );
};
