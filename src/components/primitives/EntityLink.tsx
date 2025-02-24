'use client';

import { ComponentProps, ReactNode } from 'react';
import LabeledIcon, { LabeledIconType } from './LabeledIcon';
import Badge from '../Badge';
import { clsx } from 'clsx/lite';
import LinkWithStatus from '../LinkWithStatus';
import Spinner from '../Spinner';

export interface EntityLinkExternalProps {
  type?: LabeledIconType
  badged?: boolean
  contrast?: ComponentProps<typeof Badge>['contrast']
  prefetch?: boolean
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

  const renderLabel = () => <>
    <span className="xs:hidden">
      {labelSmall ?? label}
    </span>
    <span className="hidden xs:inline-block">
      {label}
    </span>
  </>;

  return (
    <span className="group inline-flex w-full">
      <LinkWithStatus
        href={href}
        className={clsx(
          'inline-flex items-center gap-2', 
          className,
        )}
      >
        {({ isLoading }) => <>
          <LabeledIcon {...{
            icon,
            iconWide,
            href,
            prefetch,
            title,
            type,
            className: clsx(
              classForContrast(),
              href && !badged && 'hover:text-gray-900 dark:hover:text-gray-100',
            ),
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
                {renderLabel()}
              </Badge>
              : <span className={clsx(
                truncate && 'inline-flex max-w-full *:truncate',
              )}>
                {renderLabel()}
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
