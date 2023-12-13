import Link from 'next/link';
import { ReactNode } from 'react';
import Badge from './Badge';
import { cc } from '@/utility/css';

export type EntityType = 'icon-last' | 'icon-first' | 'icon-only' | 'text-only';

export default function EntityLink({
  label,
  labelSmall,
  href,
  icon,
  title,
  type = 'icon-last',
  badged,
  hoverEntity,
}: {
  label: string
  labelSmall?: string
  href: string
  icon?: ReactNode
  title?: string
  type?: EntityType
  badged?: boolean
  hoverEntity?: ReactNode
}) {
  const renderContent = () => <>
    <span className="xs:hidden">
      {labelSmall ?? label}
    </span>
    <span className="hidden xs:inline-block">
      {label}
    </span>
  </>;

  return (
    <span className="group h-6 inline-flex items-center gap-2">
      <Link
        href={href}
        title={title}
        className="inline-flex items-center gap-1"
      >
        {type !== 'icon-only' && <>
          {badged
            ? <Badge type="secondary" uppercase interactive>
              {renderContent()}
            </Badge>
            : <span className="uppercase text-medium">
              {renderContent()}
            </span>}
        </>}
        {icon && type !== 'text-only' && <span className={cc(
          'translate-y-[-1px] text-dim',
          type === 'icon-first' && 'order-first',
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
