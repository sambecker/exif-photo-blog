import { ReactNode, useRef } from 'react';
import { clsx } from 'clsx/lite';
import ExperimentalBadge from './ExperimentalBadge';
import Badge from './Badge';
import ResponsiveText from './primitives/ResponsiveText';
import { parameterize } from '@/utility/string';
import ScoreCard from './ScoreCard';
import useVisibility from '@/utility/useVisibility';

export default function ChecklistGroup({
  title,
  titleShort,
  icon,
  optional,
  experimental,
  updateHashOnVisible,
  children,
}: {
  title: string
  titleShort?: string
  icon?: ReactNode
  optional?: boolean
  experimental?: boolean
  updateHashOnVisible?: boolean
  children: ReactNode
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const slug = parameterize(title);

  useVisibility({ ref, onVisible: () => {
    if (updateHashOnVisible) {
      window.history.replaceState(null, '', `#${slug}`);
    }
  } });

  return (
    <ScoreCard title={<a
      ref={ref}
      id={slug}
      href={`#${slug}`}
      className={clsx(
        'inline-flex items-center',
        'text-gray-600 dark:text-gray-300',
        'pt-2',
        'sm:pl-1.5',
        'outline-none',
      )}
    >
      <span className="w-8 sm:w-9 shrink-0 translate-y-[-1px]">{icon}</span>
      <span className="inline-flex flex-wrap items-center gap-y-1 gap-x-2.5">
        <ResponsiveText shortText={titleShort}>
          {title}
        </ResponsiveText>
        {optional &&
          <Badge type="small">
            Optional
          </Badge>}
        {experimental &&
          <ExperimentalBadge />}
      </span>
    </a>}>
      {children}
    </ScoreCard>
  );
}
