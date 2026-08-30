'use client';

import { ReactNode, ComponentProps, RefObject } from 'react';
import { Photo, titleForPhoto } from '@/photo';
import { PhotoSetCategory } from '@/category';
import { AnimationConfig } from '../components/AnimateItems';
import { useAppState } from '@/app/AppState';
import { pathForPhoto } from '@/app/path';
import { clsx } from 'clsx/lite';
import LinkWithStatus from '@/components/LinkWithStatus';
import Spinner from '@/components/Spinner';
import LinkWithLoaderBackground from '@/components/LinkWithLoaderBackground';
import PhotoHover from './PhotoHover';

export default function PhotoLink({
  ref,
  photo,
  scroll,
  prefetch,
  nextPhotoAnimation,
  className,
  children: _children,
  loaderType = 'spinner',
  showHover,
  ...categories
}: {
  ref?: RefObject<HTMLAnchorElement | null>
  photo?: Photo
  scroll?: boolean
  prefetch?: boolean
  nextPhotoAnimation?: AnimationConfig
  className?: string
  children?: ReactNode
  loaderType?: 'spinner' | 'badge'
  showHover?: boolean
} & PhotoSetCategory) {
  const { setNextPhotoAnimation } = useAppState();

  const linkProps:
    Omit<ComponentProps<typeof LinkWithStatus>, 'children'> |
    undefined = photo
      ? {
        ref,
        className,
        href: pathForPhoto({ photo, ...categories }),
        // Always set (or clear) so a stale prev/next animation can't leak
        // into a plain thumbnail click and override its default scale-up
        onClick: () => setNextPhotoAnimation?.(nextPhotoAnimation),
        scroll,
        prefetch,
      }
      : undefined;

  const children = photo
    ? (_children ?? titleForPhoto(photo))
    : _children;

  const link = photo && linkProps
    ? loaderType === 'spinner'
      ? <LinkWithStatus {...linkProps}>
        {({ isLoading }) => <>
          {children}
          {isLoading && <>
            &nbsp;<Spinner className="translate-y-[0.5px]" />
          </>}
        </>}
      </LinkWithStatus>
      : <LinkWithLoaderBackground
        {...linkProps}
        offsetPadding
      >
        {children}
      </LinkWithLoaderBackground>
    : <span className={clsx(
      'text-gray-300 dark:text-gray-700 cursor-default',
      className,
    )}>
      {children}
    </span>;

  return photo && showHover
    ? <PhotoHover photo={photo} className="inline-flex max-w-full">
      {link}
    </PhotoHover>
    : link;
};
