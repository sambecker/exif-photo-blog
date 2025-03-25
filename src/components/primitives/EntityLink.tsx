'use client';

import { ComponentProps, ReactNode } from 'react';
import LabeledIcon, { LabeledIconType } from './LabeledIcon';
import Badge from '../Badge';
import { clsx } from 'clsx/lite';
import LinkWithStatus from '../LinkWithStatus';
import Spinner from '../Spinner';
import ResponsiveText from './ResponsiveText';

export interface EntityLinkExternalProps {
  type?: LabeledIconType
  badged?: boolean
  contrast?: ComponentProps<typeof Badge>['contrast']
  prefetch?: boolean
  className?: string
}

export default function EntityLink({
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
  hoverEntity?: ReactNode
  truncate?: boolean
  className?: string
  classNameIcon?: string
  uppercase?: boolean
  debug?: boolean
} & EntityLinkExternalProps) {
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
    <span className={clsx(
      'group inline-flex max-w-full overflow-hidden select-none',
      className,
    )}>
      <LinkWithStatus
        href={href}
        className="inline-flex items-center gap-2 max-w-full"
      >
        {({ isLoading }) => <>
          <LabeledIcon {...{
            icon,
            iconWide,
            href,
            prefetch,
            title,
            type,
            uppercase,
            className: clsx(
              classForContrast(),
              href && !badged && 'hover:text-gray-900 dark:hover:text-gray-100',
              classNameIcon,
            ),
            classNameIcon: 'text-dim',
            debug,
          }}>
            {badged
              ? <Badge
                type="small"
                contrast={contrast}
                className='translate-y-[-0.5px]'
                uppercase
                interactive
              >
                {renderLabel}
              </Badge>
              : <span className={clsx(
                truncate && 'inline-flex max-w-full *:truncate',
              )}>
                {renderLabel}
              </span>}
          </LabeledIcon>
          {!isLoading && hoverEntity !== undefined &&
            <span className="hidden group-hover:inline text-dim">
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
        </>}
      </LinkWithStatus>
    </span>
  );
}
