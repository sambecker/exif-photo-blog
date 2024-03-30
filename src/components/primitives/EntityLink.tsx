import { ReactNode } from 'react';
import LabeledIcon, { LabeledIconType } from './LabeledIcon';
import Badge from '../Badge';
import { clsx } from 'clsx/lite';

export interface EntityLinkExternalProps {
  type?: LabeledIconType
  badged?: boolean
  contrast?: 'low' | 'medium' | 'high'
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
  href,
  prefetch,
  title,
  hoverEntity,
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
  debug?: boolean
} & EntityLinkExternalProps) {
  const classForContrast = () => {
    switch (contrast) {
    case 'low':
      return 'text-dim';
    case 'high':
      return 'text-main';
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
    <span className="group inline-flex gap-2">
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
            highContrast={contrast === 'high'}
            className='translate-y-[-0.5px]'
            uppercase
            interactive
          >
            {renderLabel()}
          </Badge>
          : renderLabel()}
      </LabeledIcon>
      {hoverEntity !== undefined &&
        <span className="hidden group-hover:inline">
          {hoverEntity}
        </span>}
    </span>
  );
}
