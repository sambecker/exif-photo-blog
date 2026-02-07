import clsx from 'clsx/lite';
import { ReactNode, useEffect, useRef } from 'react';
import IconCheck from './icons/IconCheck';

export type SelectMenuOptionType<T = string> = {
  value: T
  label: ReactNode
  accessoryStart?: ReactNode
  accessoryEnd?: ReactNode
  note?: ReactNode
}

export default function SelectMenuOption<T = string>({
  label,
  accessoryStart,
  accessoryEnd,
  note,
  className,
  isSelected,
  isHighlighted,
  shouldHighlightOnHover,
  onClick,
}: {
  className?: string
  isSelected?: boolean
  isHighlighted?: boolean
  shouldHighlightOnHover?: boolean
  onClick?: () => void
} & SelectMenuOptionType<T>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHighlighted) {
      ref.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [isHighlighted]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      role="option"
      aria-selected={isSelected}
      className={clsx(
        'flex flex-col',
        'px-1.5 py-1 rounded-sm',
        'select-none',
        'cursor-pointer',
        isHighlighted && 'bg-dim',
        shouldHighlightOnHover && 'hover:bg-dim',
        onClick && 'active:bg-medium',
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        {accessoryStart &&
          <div className="shrink-0 text-medium w-5 pl-0.5">
            {accessoryStart}
          </div>}
        <div className="grow min-w-0">
          <div className="grow truncate">{label}</div>
          {note &&
            <div className="text-sm text-dim truncate">
              {note}
            </div>}
        </div>
        {(accessoryEnd || isSelected) &&
          <div className="shrink-0 text-dim">
            {isSelected 
              ? <IconCheck size={13} className="text-main" />
              : accessoryEnd}
          </div>}
      </div>
    </div>
  );
}
