import { ReactNode } from 'react';
import { clsx } from 'clsx/lite';
import ExperimentalBadge from './ExperimentalBadge';
import Badge from './Badge';
import ResponsiveText from './primitives/ResponsiveText';
import { parameterize } from '@/utility/string';

export default function Checklist({
  title,
  titleShort,
  icon,
  optional,
  experimental,
  children,
}: {
  title: string
  titleShort?: string
  icon?: ReactNode
  optional?: boolean
  experimental?: boolean
  children: ReactNode
}) {
  const slug = parameterize(title);

  return (
    <div>
      <a
        id={slug}
        href={`#${slug}`}
        className={clsx(
          'inline-flex items-center',
          'text-gray-600 dark:text-gray-300',
          'pl-[18px] py-3 text-lg',
        )}
      >
        <span className="w-7 shrink-0">{icon}</span>
        <span className="inline-flex flex-wrap items-center gap-y-1 gap-x-1.5">
          <ResponsiveText shortText={titleShort}>
            {title}
          </ResponsiveText>
          {optional &&
            <Badge type="small" className="translate-y-[0.5px]">
              Optional
            </Badge>}
          {experimental &&
            <ExperimentalBadge className="translate-y-[0.5px]" />}
        </span>
      </a>
      <div className={clsx(
        'bg-white dark:bg-black',
        'dark:text-gray-400',
        'border border-gray-200 dark:border-gray-800 rounded-md',
        'divide-y divide-gray-200 dark:divide-gray-800',
      )}>
        {children}
      </div>
    </div>
  );
}
