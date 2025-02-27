import { ReactNode } from 'react';
import { clsx } from 'clsx/lite';
import StatusIcon from './StatusIcon';
import ExperimentalBadge from './ExperimentalBadge';
import ScoreCardRow from './ScoreCardRow';

export default function ChecklistRow({
  title,
  status,
  isPending,
  optional,
  showWarning,
  experimental,
  children,
}: {
  title: string
  status: boolean
  isPending?: boolean
  optional?: boolean
  showWarning?: boolean
  experimental?: boolean
  children: ReactNode
}) {
  return (
    <ScoreCardRow
      icon={<StatusIcon
        type={status
          ? 'checked'
          : showWarning
            ? 'warning'
            : optional ? 'optional' : 'missing'}
        loading={isPending}
      />}
      content={<>
        <div className={clsx(
          'flex flex-wrap items-center gap-2 pb-0.5',
          'font-bold text-main',
        )}>
          {title}
          {experimental &&
            <ExperimentalBadge className="translate-y-[-0.5px]" />}
        </div>
        <div className="leading-relaxed text-medium">
          {children}
        </div>
      </>}
    />
  );
}
