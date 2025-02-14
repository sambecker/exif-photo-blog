import { clsx } from 'clsx/lite';
import { ReactNode, useState } from 'react';
import { LuChevronsDownUp, LuChevronsUpDown } from 'react-icons/lu';

export default function ScoreCardRow({
  icon,
  content,
  additionalContent,
  className,
}: {
  icon: ReactNode
  content: ReactNode
  additionalContent?: ReactNode
  className?: string
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={clsx(
      'flex',
      'py-2 pr-2',
      className,
    )}>
      <div className={clsx(
        'flex justify-center pt-[8px] w-11 sm:w-14',
        'shrink-0 text-icon',
      )}>
        {icon}
      </div>
      <div className="grow space-y-2 py-1.5 w-full overflow-auto">
        <div className="text-main pr-2">
          {content}
        </div>
        {isExpanded &&
          <div className="text-medium">
            {additionalContent}
          </div>}
      </div>
      {additionalContent && <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={clsx(
          'flex items-center justify-center',
          'w-9 h-8',
          '*:shrink-0',
        )}
      >
        {isExpanded
          ? <LuChevronsDownUp size={16} />
          : <LuChevronsUpDown size={16} />}
      </button>}
    </div>
  );
}
