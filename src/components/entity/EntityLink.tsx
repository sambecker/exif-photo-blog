'use client';

import { ComponentProps, ReactNode, RefObject, useState } from 'react';
import LabeledIcon, { LabeledIconType } from '../primitives/LabeledIcon';
import Badge from '../Badge';
import { clsx } from 'clsx/lite';
import LinkWithStatus from '../LinkWithStatus';
import Spinner from '../Spinner';
import ResponsiveText from '../primitives/ResponsiveText';
import { SHOW_CATEGORY_IMAGE_HOVERS } from '@/app/config';
import EntityHover from './EntityHover';
import { getPhotosCachedAction } from '@/photo/actions';
import { PhotoQueryOptions } from '@/photo/db';
import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response';

export interface EntityLinkExternalProps {
  ref?: RefObject<HTMLSpanElement | null>
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
  showHover = SHOW_CATEGORY_IMAGE_HOVERS,
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
  icon: ReactNode
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
  const [isLoading, setIsLoading] = useState(false);

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
            type="small"
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

  return (
    <span
      ref={ref}
      className={clsx(
        'inline-flex items-center gap-2',
        'max-w-full overflow-hidden select-none',
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
    </span>
  );
}
