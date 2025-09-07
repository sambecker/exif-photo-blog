import clsx from 'clsx/lite';
import { ReactNode, useState } from 'react';
import { LuChevronRight } from 'react-icons/lu';

export default function SmallDisclosure({
  label,
  children,
}: {
  label: ReactNode
  children: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="space-y-2">
      <button
        type="button"
        className={clsx(
          'flex items-center gap-1.5 link',
          'hover:opacity-100!',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={clsx(
          'transition-transform duration-200',
          isOpen && 'rotate-90',
        )}>
          <LuChevronRight size={16} />
        </span>
        <span>{label}</span>
      </button>
      {isOpen &&
        <div className="pl-5.5">
          {children}
        </div>}
    </div>
  );
}
