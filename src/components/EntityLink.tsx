import Link from 'next/link';
import { ReactNode } from 'react';
import Badge from './Badge';
import { clsx } from 'clsx/lite';

export interface EntityLinkExternalProps {
  type?: 'icon-last' | 'icon-first' | 'icon-only' | 'text-only'
  badged?: boolean
  contrast?: 'low' | 'medium' | 'high'
}

export default function EntityLink({
  label,
  labelSmall,
  href,
  icon,
  title,
  type = 'icon-first',
  badged,
  contrast = 'high',
  hoverEntity,
}: {
  label: ReactNode
  labelSmall?: ReactNode
  href: string
  icon?: ReactNode
  title?: string
  hoverEntity?: ReactNode
} & EntityLinkExternalProps) {
  const renderLabel = () => <>
    <span className="xs:hidden">
      {labelSmall ?? label}
    </span>
    <span className="hidden xs:inline-block">
      {label}
    </span>
  </>;

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

  return (
    <span className="group inline-flex items-center gap-2 h-5">
      <Link
        href={href}
        title={title}
        className={clsx(
          'inline-flex gap-[0.23rem]',
          !badged && 'text-main hover:text-gray-900 dark:hover:text-gray-100',
          classForContrast(),
        )}
      >
        {type !== 'icon-only' && <>
          {badged
            ? <span className="h-6 inline-flex items-center">
              <Badge
                type="small"
                highContrast={contrast === 'high'}
                uppercase
                interactive
              >
                {renderLabel()}
              </Badge>
            </span>
            : <span className="uppercase">
              {renderLabel()}
            </span>}
        </>}
        {icon && type !== 'text-only' &&
          <span className={clsx(
            'flex-shrink-0',
            'inline-flex min-w-[0.9rem]',
            contrast === 'high'
              ? 'text-icon'
              : classForContrast(),
            type === 'icon-first' && 'order-first',
            badged && 'translate-y-[4px]',
            hoverEntity !== undefined && 'group-hover:hidden',
          )}>
            {icon}
          </span>}
      </Link>
      {hoverEntity !== undefined &&
        <span className="hidden group-hover:inline">
          {hoverEntity}
        </span>}
    </span>
  );
}
