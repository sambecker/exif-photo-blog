import clsx from 'clsx/lite';
import { ReactNode } from 'react';
import IconCheck from './icons/IconCheck';

export interface SelectMenuOptionType {
  value: string
  label: ReactNode
  accessoryStart?: ReactNode
  accessoryEnd?: ReactNode
  note?: ReactNode
}

export default function SelectMenuOption({
  value,
  label,
  accessoryStart,
  accessoryEnd,
  note,
  isHighlighted,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  isHighlighted?: boolean
  isSelected?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
} & SelectMenuOptionType) {
  return (
    <div
      key={value}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={clsx(
        'group flex flex-col truncate',
        'px-1.5 py-1 rounded-sm',
        'text-base select-none',
        'cursor-pointer',
        isHighlighted && 'bg-gray-100 dark:bg-gray-800',
        onClick && 'active:bg-gray-200/80 dark:active:bg-gray-800/80',
        'focus:bg-gray-100 dark:focus:bg-gray-800',
        'outline-hidden',
      )}
    >
      <div className="flex items-center gap-2.5">
        {accessoryStart &&
          <div className="shrink-0">
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
              : accessoryEnd }
          </div>}
      </div>
    </div>
  );
}
