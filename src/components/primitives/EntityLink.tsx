'use client';

import { ComponentProps, ReactNode, RefObject, useState } from 'react';
import LabeledIcon, { LabeledIconType } from './LabeledIcon';
import Badge from '../Badge';
import { clsx } from 'clsx/lite';
import LinkWithStatus from '../LinkWithStatus';
import Spinner from '../Spinner';
import ResponsiveText from './ResponsiveText';
import OGTooltip from '../og/OGTooltip';
import { SHOW_CATEGORY_IMAGE_HOVERS } from '@/app/config';

export interface EntityLinkExternalProps {
  ref?: RefObject<HTMLSpanElement | null>
  type?: LabeledIconType
  badged?: boolean
  contrast?: ComponentProps<typeof Badge>['contrast']
  showTooltip?: boolean
  uppercase?: boolean
  prefetch?: boolean
  suppressSpinner?: boolean
  className?: string
}

export default function EntityLink({
  ref,
  icon,
  iconBadge,
  label,
  labelSmall,
  labelComplex,
  iconWide,
  type,
  badged,
  contrast = 'medium',
  showTooltip = SHOW_CATEGORY_IMAGE_HOVERS,
  path = '', // Make link optional for debugging purposes
  tooltipImagePath,
  tooltipCaption,
  prefetch,
  title,
  action,
  hoverEntity,
  truncate = true,
  className,
  classNameIcon,
  uppercase,
  suppressSpinner,
  debug,
}: {
  icon: ReactNode
  iconBadge?: ReactNode
  label: string
  labelSmall?: ReactNode
  labelComplex?: ReactNode
  iconWide?: boolean
  path?: string
  tooltipImagePath?: string
  tooltipCaption?: ReactNode
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

  const showHoverEntity =
    !isLoading &&
    hoverEntity !== undefined &&
    !showTooltip;

  const renderLabel =
    <ResponsiveText shortText={labelSmall}>
      {labelComplex || label}
    </ResponsiveText>;

  const renderLink =
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
        icon,
        iconWide,
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
            className={clsx(
              'translate-y-[-0.5px]',
              iconBadge && '*:flex *:items-center *:gap-1',
            )}
            uppercase
            interactive
          >
            {iconBadge}
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
      {showTooltip && tooltipImagePath
        ? <OGTooltip
          title={label}
          path={tooltipImagePath}
          caption={tooltipCaption}
          color={contrast === 'frosted' ? 'frosted' : undefined}
        >
          {renderLink}
        </OGTooltip>
        : renderLink}
      {action &&
        <span className="action">
          {action}
        </span>}
      {showHoverEntity &&
        <span className="hidden peer-hover:inline text-dim">
          {hoverEntity}
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
