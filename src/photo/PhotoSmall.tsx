'use client';

import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
} from '.';
import { PhotoSetCategory } from '../category';
import ImageSmall from '@/components/image/ImageSmall';
import LinkWithStatus from '@/components/LinkWithStatus';
import Spinner from '@/components/Spinner';
import { clsx } from 'clsx/lite';
import { pathForPhoto } from '@/app/path';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/app/config';
import { useRef } from 'react';
import useVisible from '@/utility/useVisible';

export default function PhotoSmall({
  photo,
  selected,
  className,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  onVisible,
  ...categories
}: {
  photo: Photo
  selected?: boolean
  className?: string
  prefetch?: boolean
  onVisible?: () => void
} & PhotoSetCategory) {
  const ref = useRef<HTMLAnchorElement>(null);

  useVisible({ ref, onVisible });

  return (
    <LinkWithStatus
      ref={ref}
      href={pathForPhoto({ photo, ...categories })}
      className={clsx(
        className,
        'relative block',
        'transition-transform duration-150 ease-out',
        'active:scale-[0.985] active:brightness-75',
        selected && 'brightness-50',
        'min-w-[50px]',
        'rounded-[3px] overflow-hidden',
        'border-main',
      )}
      prefetch={prefetch}
    >
      {({ isLoading }) =>
        <>
          <ImageSmall
            src={photo.url}
            aspectRatio={photo.aspectRatio}
            blurDataURL={photo.blurData}
            blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
            alt={altTextForPhoto(photo)}
          />
          {isLoading &&
            <div className={clsx(
              'absolute inset-0 flex items-center justify-center',
              'bg-black/30 backdrop-blur-[2px] animate-fade-in',
              'pointer-events-none z-10',
            )}>
              <Spinner size={14} color="text" />
            </div>}
        </>}
    </LinkWithStatus>
  );
};
