import clsx from 'clsx/lite';
import { ReactNode, useEffect, useRef, useState } from 'react';
import MaskedScroll from './MaskedScroll';
import useClickInsideOutside from '@/utility/useClickInsideOutside';

const KEY_KEYDOWN = 'keydown';

interface SelectMenuOption {
  value: string
  label: ReactNode
  accessoryStart?: ReactNode
  accessoryEnd?: ReactNode
  note?: ReactNode
}

export default function SelectMenu({
  name,
  value,
  onChange,
  options,
  children,
}: {
  id?: string
  name: string
  value: string
  onChange: (value: string) => void
  options: SelectMenuOption[]
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>();

  useClickInsideOutside({
    htmlElements: [ref],
    onClickOutside: () => setIsOpen(false),
  });
  // Setup keyboard listener
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      // Keys which always trap focus
      switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Escape':
        e.stopImmediatePropagation();
        e.preventDefault();
      }
      switch (e.key) {
      case 'ArrowDown':
        if (isOpen) {
          setSelectedOptionIndex(i => {
            if (i === undefined) {
              return options.length > 1 ? 1 : 0;
            } else if (i >= options.length - 1) {
              return 0;
            } else {
              return i + 1;
            }
          });
        } else {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        setSelectedOptionIndex(i => {
          if (
            document.activeElement === ref.current &&
            options.length > 0
          ) {
            return options.length - 1;
          } else if (i === undefined || i === 0) {
            ref.current?.focus();
            return undefined;
          } else {
            return i - 1;
          }
        });
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      }
    };

    const refRef = ref.current;

    refRef?.addEventListener(KEY_KEYDOWN, listener);

    return () => refRef?.removeEventListener(KEY_KEYDOWN, listener);
  }, [
    isOpen,
    options,
    selectedOptionIndex,
  ]);

  return <div ref={ref}>
    {/* <input type="hidden" name={name} value={value} /> */}
    <div
      tabIndex={0}
      className={clsx(
        'cursor-pointer control',
        'focus:outline-2 -outline-offset-2 focus:outline-blue-600',
        'text-lg leading-[1.4]',
        'select-none',
      )}
      onFocus={() => setIsOpen(true)}
    >
      {children}
      <input type="hidden" name={name} value={value} />
    </div>
    <div className="relative">
      {isOpen &&
        <div
          className={clsx(
            'absolute top-3 left-0 w-full',
            'component-surface',
            'px-1.5 py-1.5',
            'max-h-[8rem] overflow-y-auto flex flex-col',
            'shadow-lg dark:shadow-xl',
            'animate-fade-in-from-top',
            '*:select-none',
          )}
        >
          <MaskedScroll fadeSize={16}>
            {options.map((option, index) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setSelectedOptionIndex(index)}
                onMouseLeave={() => setSelectedOptionIndex(undefined)}
                className={clsx(
                  'group flex flex-col',
                  'px-1.5 py-1 rounded-sm',
                  'text-base select-none',
                  'cursor-pointer',
                  (index === selectedOptionIndex ||
                    (selectedOptionIndex === undefined && index === 0)) &&
                    'bg-gray-100 dark:bg-gray-800',
                  'active:bg-gray-200/80 dark:active:bg-gray-800/80',
                  'focus:bg-gray-100 dark:focus:bg-gray-800',
                  'outline-hidden',
                )}
              >
                <div className="flex items-center gap-2.5">
                  {option.accessoryStart &&
                    <div className="shrink-0">
                      {option.accessoryStart}
                    </div>}
                  <span className="grow">
                    {option.label}
                    {option.note &&
                      <div className="text-sm text-dim">
                        {option.note}
                      </div>}
                  </span>
                  {option.accessoryEnd &&
                    <div className="shrink-0 text-dim">
                      {option.accessoryEnd}
                    </div>}
                </div>
              </div>
            ))}
          </MaskedScroll>
        </div>}
    </div>
  </div>;
}
