import { clsx } from 'clsx';
import { ReactNode, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
export default function ScoreCardRow({
  icon,
  content,
  additionalContent,
}: {
  icon: ReactNode
  content: ReactNode
  additionalContent?: ReactNode
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className={clsx(
      'flex gap-4',
      'px-4 py-2',
    )}>
      <div className="pt-[8px] shrink-0 text-main">
        {icon}
      </div>
      <div className="grow space-y-2 py-1.5">
        <div className="text-main">
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
        className="px-[9px] self-start -mr-1"
      >
        {isExpanded
          ? <FaMinus />
          : <FaPlus />}
      </button>}
    </div>
  );
}
