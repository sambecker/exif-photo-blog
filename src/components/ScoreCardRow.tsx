import { clsx } from 'clsx';
import { ReactNode, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';

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
          <div className="text-sm text-medium">
            {additionalContent}
          </div>}
      </div>
      {additionalContent && <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-[9px] self-start"
      >
        {isExpanded
          ? <FaMinus />
          : <FaPlus />}
      </button>}
    </div>
  );
}
