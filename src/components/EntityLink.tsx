import Link from 'next/link';
import { ReactNode } from 'react';
import Badge from './Badge';
import { cc } from '@/utility/css';

export interface EntityLinkExternalProps {
  type?: 'icon-last' | 'icon-first' | 'icon-only' | 'text-only'
  badged?: boolean
  dim?: boolean
}

export default function EntityLink({
  label,
  labelSmall,
  href,
  icon,
  title,
  type = 'icon-first',
  badged,
  hoverEntity,
  dim,
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

  return (
    <span className="group inline-flex items-center gap-2 overflow-hidden">
      <Link
        href={href}
        title={title}
        className={cc(
          'inline-flex gap-[0.23rem]',
          !badged && 'text-main hover:text-gray-900 dark:hover:text-gray-100',
          dim && 'text-dim',
        )}
      >
        {type !== 'icon-only' && <>
          {badged
            ? <span className="h-6 inline-flex items-center">
              <Badge type="secondary" uppercase interactive>
                {renderLabel()}
              </Badge>
            </span>
            : <span className="uppercase">
              {renderLabel()}
            </span>}
        </>}
        {icon && type !== 'text-only' &&
          <span className={cc(
            'flex-shrink-0',
            'text-dim inline-flex min-w-[0.9rem]',
            type === 'icon-first' && 'order-first',
            badged && 'translate-y-[4px]',
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
