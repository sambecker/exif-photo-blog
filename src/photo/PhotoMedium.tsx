'use client';

/* eslint-disable max-len */

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
import { memo, useRef } from 'react';
import useVisible from '@/utility/useVisible';
import LinkWithStatus from '@/components/LinkWithStatus';
import Spinner from '@/components/Spinner';
import PhotoColors from './color/PhotoColors';
import PhotoTags from '@/tag/PhotoTags';
import { sortTagsArray } from '@/tag';

function PhotoMedium({
  photo,
  selected,
  priority,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  className,
  onVisible,
  debugColor,
  disableLink,
  ...categories
}: {
  photo: Photo
  selected?: boolean
  priority?: boolean
  prefetch?: boolean
  className?: string
  onVisible?: () => void
  debugColor?: boolean
  disableLink?: boolean
} & PhotoSetCategory) {
  const ref = useRef<HTMLAnchorElement>(null);

  useVisible({ ref, onVisible });

  const tags = sortTagsArray(photo.tags);

  return (
    <div className={clsx(
      'group relative',
      'transition-[filter,transform] duration-200 ease-out',
      selected && 'scale-[0.985]',
      className,
    )}>
      <LinkWithStatus
        ref={ref}
        href={pathForPhoto({ photo, ...categories })}
        className={clsx(
          'block h-full',
          // Instant tactile feedback on click — fires before navigation
          'transition-transform duration-150 ease-out',
          'active:scale-[0.985] active:brightness-75',
          selected && 'brightness-50',
          disableLink && 'pointer-events-none',
        )}
        prefetch={prefetch}
        onContextMenu={(e) => e.preventDefault()}
        style={{ WebkitTouchCallout: 'none' }}
      >
        {({ isLoading }) =>
          <div className="w-full h-full relative block">
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
              className="object-cover w-full h-full"
              classNameImage="object-cover w-full h-full"
              alt={altTextForPhoto(photo)}
              priority={priority}
            />
          </div>}
      </LinkWithStatus>
      {tags.length > 0 &&
        <div className={clsx(
          'absolute inset-x-0 bottom-0 z-10',
          'pb-2 pt-8 px-2',
          'bg-gradient-to-t from-black/60 to-transparent',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'pointer-events-none', // Allow clicks to pass through to photo link
          // Force tag text white in both light and dark mode + smaller size
          'text-[0.65rem] leading-tight',
          '[&_a]:text-white! [&_.text-content]:text-white!',
          '[&_a:hover]:text-white! [&_a:hover]:opacity-80',
        )}>
          <div className="pointer-events-auto"> {/* Re-enable clicks for tags */}
            <PhotoTags
              tags={tags}
              contrast="high"
              badged
            />
          </div>
        </div>}
    </div>
  );
};

// Memoize so toggling selection on one tile doesn't rerender the whole grid
export default memo(PhotoMedium, (prev, next) =>
  prev.photo.id === next.photo.id &&
  prev.selected === next.selected &&
  prev.priority === next.priority &&
  prev.disableLink === next.disableLink &&
  prev.debugColor === next.debugColor &&
  prev.className === next.className,
);
