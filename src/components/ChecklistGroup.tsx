import { ReactNode } from 'react';
import { clsx } from 'clsx/lite';
import ExperimentalBadge from './ExperimentalBadge';
import Badge from './Badge';
import ResponsiveText from './primitives/ResponsiveText';
import { parameterize } from '@/utility/string';
import ScoreCard from './ScoreCard';

export default function ChecklistGroup({
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
    <ScoreCard title={<a
      id={slug}
      href={`#${slug}`}
      className={clsx(
        'inline-flex items-center',
        'text-gray-600 dark:text-gray-300',
        'sm:pl-1.5',
      )}
    >
      <span className="w-8 sm:w-9 shrink-0">{icon}</span>
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
    </a>}>
      {children}
    </ScoreCard>
  );
}
