'use client';

/* eslint-disable no-duplicate-imports, react-hooks/exhaustive-deps */

/* eslint-disable max-len */

import { ComponentProps, ReactNode, RefObject, useCallback, useRef, useState } from 'react';
import { useSWRConfig } from 'swr';
import LabeledIcon, { LabeledIconType } from '../primitives/LabeledIcon';
import Badge from '../Badge';
import { clsx } from 'clsx/lite';
import LinkWithStatus from '../LinkWithStatus';
import Spinner from '../Spinner';
import ResponsiveText from '../primitives/ResponsiveText';
import { SHOW_CATEGORY_IMAGE_HOVERS } from '@/app/config';
import EntityHover from './EntityHover';
import { SWR_KEYS } from '@/swr';
import { getPhotosCachedAction } from '@/photo/actions';
import { PhotoQueryOptions } from '@/photo/db';
import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response';
import { IMAGE_WIDTH_MEDIUM } from '@/components/image';
import { IMAGE_QUALITY } from '@/app/config';

import useVisible from '@/utility/useVisible';
import { useSharedHoverState } from '../shared-hover/state';

export interface EntityLinkExternalProps {
  ref?: RefObject<HTMLDivElement | null>
  type?: LabeledIconType
  badged?: boolean
  contrast?: ComponentProps<typeof Badge>['contrast']
  uppercase?: boolean
  prefetch?: boolean
  suppressSpinner?: boolean
  className?: string
  countOnHover?: number
  showHover?: boolean
  hoverPhotoQueryOptions?: PhotoQueryOptions
}

export default function EntityLink({
  ref,
  icon,
  iconBadgeStart,
  iconBadgeEnd,
  label,
  labelSmall,
  iconWide,
  type,
  badged,
  contrast = 'medium',
  path = '', // Make link optional for debugging purposes
  showHover: showHoverProp = SHOW_CATEGORY_IMAGE_HOVERS,
  countOnHover,
  hoverPhotoQueryOptions,
  prefetch,
  title,
  action,
  truncate = true,
  className,
  classNameIcon,
  uppercase,
  suppressSpinner,
  debug,
}: {
  icon?: ReactNode
  iconBadgeStart?: ReactNode
  iconBadgeEnd?: ReactNode
  label: string
  labelSmall?: ReactNode
  iconWide?: boolean
  path?: string
  prefetch?: boolean
  title?: string
  action?: ReactNode
  truncate?: boolean
  className?: string
  classNameIcon?: string
  uppercase?: boolean
  debug?: boolean
} & EntityLinkExternalProps) {
  // Force-respect global env flag — if SHOW_CATEGORY_IMAGE_HOVERS is false,
  // hover previews are disabled regardless of the prop value passed by callers.
  const showHover = showHoverProp && SHOW_CATEGORY_IMAGE_HOVERS;

  const { mutate } = useSWRConfig();
  const [isLoading, setIsLoading] = useState(false);
  const internalRef = useRef<HTMLDivElement>(null);
  const effectiveRef = (ref as RefObject<HTMLDivElement | null>) || internalRef;
  const hasPrefetched = useRef(false);

  const hasBadgeIcon = Boolean(iconBadgeStart || iconBadgeEnd);

  const classForContrast = () => {
    switch (contrast) {
      case 'low':
        return 'text-dim';
      case 'high':
        return 'text-main';
      case 'frosted':
        return 'text-black';
      default:
        return 'text-medium';
    }
  };

  const showHoverEntity =
    !isLoading &&
    countOnHover &&
    !showHover;

  const renderLabel =
    <ResponsiveText shortText={labelSmall}>
      {label}
    </ResponsiveText>;

  const {
    showHover: showSharedHover,
    dismissHover: dismissSharedHover,
    renderHover: renderSharedHover,
  } = useSharedHoverState();

  const renderLink = (useForHover?: boolean) =>
    <LinkWithStatus
      href={path}
      className={clsx(
        'peer',
        'inline-flex items-center gap-2 max-w-full truncate',
        classForContrast(),
        path && !badged && contrast !== 'frosted' &&
        'hover:text-gray-900 dark:hover:text-gray-100',
        path && !badged && 'active:text-medium!',
      )}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
    >
      <LabeledIcon {...{
        icon:
          (badged && hasBadgeIcon && !useForHover) ? undefined : icon,
        iconWide:
          (badged && hasBadgeIcon && !useForHover) ? undefined : iconWide,
        prefetch,
        title,
        type: useForHover ? 'icon-first' : type,
        uppercase,
        className: useForHover ? 'text-white' : undefined,
        classNameIcon: clsx(
          !useForHover && 'text-dim',
          classNameIcon,
        ),
        debug,
      }}>
        {badged && !useForHover
          ? <Badge
            type={type === 'text-only' ? 'text-only' : 'small'}
            contrast={contrast}
            className={clsx(
              'translate-y-[-0.5px]',
              hasBadgeIcon && '*:flex *:items-center *:gap-1',
            )}
            uppercase
            interactive
          >
            {iconBadgeStart}
            {renderLabel}
            {iconBadgeEnd}
          </Badge>
          : <span className={clsx(
            'text-content',
            truncate && 'inline-flex max-w-full *:truncate',
            'decoration-dotted underline-offset-[4px]',
            'decoration-gray-300 dark:decoration-gray-600',
          )}>
            {renderLabel}
          </span>}
      </LabeledIcon>
    </LinkWithStatus>;


  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (showHover && countOnHover && hoverPhotoQueryOptions && showSharedHover && renderSharedHover) {
      // Prefetch photos
      mutate(
        `${SWR_KEYS.SHARED_HOVER}-${path}`,
        getPhotosCachedAction({
          ...hoverPhotoQueryOptions,
          limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
        }),
      );
      showSharedHover(e.currentTarget as HTMLElement, {
        key: path,
        width: 300, // Default width
        height: 200, // Default height
        offsetAbove: 0,
        offsetBelow: 0,
        color: contrast === 'frosted' ? 'frosted' : undefined,
      });
      renderSharedHover(
        <EntityHover
          hoverKey={path}
          header={renderLink(true)}
          photosCount={countOnHover}
          getPhotos={() =>
            getPhotosCachedAction({
              ...hoverPhotoQueryOptions,
              limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
            })}
          color={contrast === 'frosted' ? 'frosted' : undefined}
        >
          {/* Add empty children to satisfy the type requirement */}
          <></>
        </EntityHover>,
      );
    }
  }, [showHover, countOnHover, hoverPhotoQueryOptions, showSharedHover, renderSharedHover, path, contrast]);

  const handleMouseLeave = useCallback(() => {
    if (showHover && countOnHover && hoverPhotoQueryOptions && dismissSharedHover) {
      dismissSharedHover(ref && 'current' in ref ? ref.current : null);
    }
  }, [showHover, countOnHover, hoverPhotoQueryOptions, dismissSharedHover, ref]);

  const onVisible = useCallback(() => {
    if (
      showHover &&
      countOnHover &&
      hoverPhotoQueryOptions &&
      !hasPrefetched.current
    ) {
      hasPrefetched.current = true;
      const fetcher = () => getPhotosCachedAction({
        ...hoverPhotoQueryOptions,
        limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
      });
      mutate(
        `${SWR_KEYS.SHARED_HOVER}-${path}`,
        fetcher().then((photos) => {
          photos.slice(0, 6).forEach((photo) => {
            const img = new Image();
            const url = photo.url;
            // Construct Next.js optimized image URL matched to ImageMedium
            // width: IMAGE_WIDTH_MEDIUM (300)
            // quality: IMAGE_QUALITY
            img.src = `/_next/image?url=${encodeURIComponent(url)}&w=${IMAGE_WIDTH_MEDIUM}&q=${IMAGE_QUALITY}`;
          });
          return photos;
        }),
      );
    }
  }, [
    showHover,
    countOnHover,
    hoverPhotoQueryOptions,
    path,
    mutate,
  ]);

  useVisible({
    ref: effectiveRef,
    onVisible,
  });

  return (
    <div
      ref={effectiveRef}
      {...(showHover && countOnHover && hoverPhotoQueryOptions ? {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      } : {})}
      className={clsx(
        'inline-flex items-center gap-2',
        showHover ? 'max-w-full overflow-hidden' : 'whitespace-nowrap',
        'select-none',
        // Underline link text when action is hovered
        '[&:has(.action:hover)_.text-content]:underline',
        className,
      )}
    >
      {showHover && countOnHover && hoverPhotoQueryOptions
        ? <EntityHover
          hoverKey={path}
          header={renderLink(true)}
          photosCount={countOnHover}
          getPhotos={() =>
            getPhotosCachedAction({
              ...hoverPhotoQueryOptions,
              limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
            })}
          color={contrast === 'frosted' ? 'frosted' : undefined}
        >
          {renderLink()}
        </EntityHover>
        : renderLink()}
      {action &&
        <span className="action">
          {action}
        </span>}
      {showHoverEntity &&
        <span className="hidden peer-hover:inline text-dim">
          {countOnHover}
        </span>}
      {isLoading && !suppressSpinner &&
        <Spinner
          className={clsx(
            badged && 'translate-y-[0.5px]',
            contrast === 'frosted' && 'text-neutral-500',
          )}
          color={contrast === 'frosted' ? 'text' : undefined}
        />}
    </div>
  );
}