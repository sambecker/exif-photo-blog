'use client';

import { ComponentProps, ReactNode, RefObject, useState } from 'react';
import LabeledIcon, { LabeledIconType } from './LabeledIcon';
import Badge from '../Badge';
import { clsx } from 'clsx/lite';
import LinkWithStatus from '../LinkWithStatus';
import Spinner from '../Spinner';
import ResponsiveText from './ResponsiveText';

export interface EntityLinkExternalProps {
  ref?: RefObject<HTMLSpanElement | null>
  type?: LabeledIconType
  badged?: boolean
  contrast?: ComponentProps<typeof Badge>['contrast']
  uppercase?: boolean
  prefetch?: boolean
  className?: string
}

export default function EntityLink({
  ref,
  icon,
  label,
  labelSmall,
  iconWide,
  type,
  badged,
  contrast = 'medium',
  href = '', // Make link optional for debugging purposes
  prefetch,
  title,
  action,
  hoverEntity,
  truncate = true,
  className,
  classNameIcon,
  uppercase,
  debug,
}: {
  icon: ReactNode
  label: ReactNode
  labelSmall?: ReactNode
  iconWide?: boolean
  href?: string
  prefetch?: boolean
  title?: string
  action?: ReactNode
  hoverEntity?: ReactNode
  truncate?: boolean
  className?: string
  classNameIcon?: string
  uppercase?: boolean
  debug?: boolean
} & EntityLinkExternalProps) {
  const [isLoading, setIsLoading] = useState(false);

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

  const renderLabel =
    <ResponsiveText shortText={labelSmall}>
      {label}
    </ResponsiveText>;

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
      <LinkWithStatus
        href={href}
        className={clsx(
          'peer',
          'inline-flex items-center gap-2 max-w-full truncate',
          classForContrast(),
          href && !badged && 'hover:text-gray-900 dark:hover:text-gray-100',
          href && !badged && 'active:text-medium!',
        )}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      >
        <LabeledIcon {...{
          icon,
          iconWide,
          href,
          prefetch,
          title,
          type,
          uppercase,
          classNameIcon: clsx('text-dim', classNameIcon),
          debug,
        }}>
          {badged
            ? <Badge
              type="small"
              contrast={contrast}
              className="translate-y-[-0.5px]"
              uppercase
              interactive
            >
              {renderLabel}
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
      </LinkWithStatus>
      {action &&
        <span className="action">
          {action}
        </span>}
      {!isLoading && hoverEntity !== undefined &&
        <span className="hidden peer-hover:inline text-dim">
          {hoverEntity}
        </span>}
      {isLoading &&
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
