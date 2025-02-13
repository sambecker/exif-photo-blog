import { clsx } from 'clsx';
import { ReactNode } from 'react';
export default function ScoreCardRow({
  icon,
  children,
  details,
}: {
  icon: ReactNode
  children: ReactNode
  details?: string
}) {
  return (
    <div className={clsx(
      'flex items-center gap-4',
      'px-4 py-2',
    )}>
      <div className="flex items-center gap-2 shrink-0">
        {icon}
      </div>
      <div>
        {children}
      </div>
      {details &&
        <span className="text-sm text-gray-500">
          {details}
        </span>}
    </div>
  );
}
