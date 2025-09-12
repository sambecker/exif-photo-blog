import { clsx } from 'clsx/lite';
import { ReactNode, useState } from 'react';
import {
  LuChevronRight,
  LuChevronsDownUp,
  LuChevronsUpDown,
} from 'react-icons/lu';
import LinkWithStatus from './LinkWithStatus';
import Spinner from './Spinner';

const expandAccessoryClasses = clsx(
  'flex items-center justify-center',
  'w-9 h-8',
  '*:shrink-0',
);

export default function ScoreCardRow({
  icon,
  content,
  expandContent,
  expandPath,
  className,
}: {
  icon: ReactNode
  content: ReactNode | ((isExpanded?: boolean) => ReactNode)
  expandContent?: ReactNode
  expandPath?: string
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
      <div className={clsx(
        'grow space-y-2 py-1.5 w-full overflow-auto',
        // Allowing expanded content to flow under expand button
        expandContent && isExpanded && '-mr-6',
      )}>
        <div className={clsx(
          'text-main pr-2',
          // Correct for expanded content in section title
          expandContent && isExpanded && 'mr-6',
          expandContent && !isExpanded && 'max-w-full truncate',
        )}>
          {typeof content === 'function'
            ? content(isExpanded)
            : content}
        </div>
        {isExpanded &&
          <div className={clsx(
            'text-medium leading-relaxed',
          )}>
            {expandContent}
          </div>}
      </div>
      {expandContent && <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={expandAccessoryClasses}
      >
        {isExpanded
          ? <LuChevronsDownUp size={16} />
          : <LuChevronsUpDown size={16} />}
      </button>}
      {expandPath && <LinkWithStatus
        className={clsx('button', expandAccessoryClasses)}
        href={expandPath}
      >
        {({ isLoading }) => <> {isLoading
          ? <Spinner />
          : <LuChevronRight size={16} />}
        </>}
      </LinkWithStatus>}
    </div>
  );
}
