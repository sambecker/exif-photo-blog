'use client';

import { ReactNode, ComponentProps, RefObject } from 'react';
import { Photo, titleForPhoto } from '@/photo';
import { PhotoSetCategory } from '@/category';
import { AnimationConfig } from '../components/AnimateItems';
import { useAppState } from '@/state/AppState';
import { pathForPhoto } from '@/app/paths';
import { clsx } from 'clsx/lite';
import LinkWithStatus from '@/components/LinkWithStatus';
import Spinner from '@/components/Spinner';
import LinkWithLoaderBackground from '@/components/LinkWithLoaderBackground';

export default function PhotoLink({
  ref,
  photo,
  scroll,
  prefetch,
  nextPhotoAnimation,
  className,
  children: _children,
  loaderType = 'spinner',
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
} & PhotoSetCategory) {
  const { setNextPhotoAnimation } = useAppState();

  const linkProps:
    Omit<ComponentProps<typeof LinkWithStatus>, 'children'> |
    undefined = photo
      ? {
        ref,
        className,
        href: pathForPhoto({ photo, ...categories }),
        onClick: () => {
          if (nextPhotoAnimation) {
            setNextPhotoAnimation?.(nextPhotoAnimation);
          }
        },
        scroll,
        prefetch,
      }
      : undefined;

  const children = photo
    ? (_children ?? titleForPhoto(photo))
    : _children;

  return (
    photo && linkProps
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
      </span>
  );
};
