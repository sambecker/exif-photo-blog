import clsx from 'clsx/lite';
import { ReactNode, useEffect, useRef, useState } from 'react';
import MaskedScroll from './MaskedScroll';
import useClickInsideOutside from '@/utility/useClickInsideOutside';
import IconSelectChevron from './icons/IconSelectChevron';
import SelectMenuOption, { SelectMenuOptionType } from './SelectMenuOption';

const KEY_KEYDOWN = 'keydown';

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
  options: SelectMenuOptionType[]
  children?: ReactNode
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
      // Navigate options
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
      case 'Enter':
        if (isOpen) {
          if (selectedOptionIndex !== undefined) {
            onChange(options[selectedOptionIndex].value);
          }
          setIsOpen(false);
        }
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
    onChange,
  ]);

  const selectedOption = options.find(o => o.value === value);

  return <div ref={ref}>
    <div
      tabIndex={0}
      className={clsx(
        'cursor-pointer control pl-1.5',
        'focus:outline-2 -outline-offset-2 focus:outline-blue-600',
        'text-lg leading-[1.4]',
        'select-none',
      )}
      onFocus={() => setIsOpen(true)}
      onBlur={() => {
        if (document.activeElement === ref.current) {
          setIsOpen(false);
        }
      }}
    >
      {children ?? <div className="flex items-center">
        <div className="grow min-w-0">
          <SelectMenuOption
            value={value}
            label={selectedOption?.label}
            accessoryStart={selectedOption?.accessoryStart}
          />
        </div>
        <IconSelectChevron
          className={clsx(
            'shrink-0',
            isOpen && 'rotate-180 transition-transform duration-200',
          )}
        />
      </div>}
      <input type="hidden" name={name} value={value} />
    </div>
    <div className="relative">
      {isOpen &&
        <div
          className={clsx(
            'absolute top-3 left-0 w-full',
            'component-surface',
            'px-1.5 py-1.5',
            'max-h-[12rem] overflow-y-auto flex flex-col',
            'shadow-lg dark:shadow-xl',
            'animate-fade-in-from-top',
            '*:select-none',
          )}
        >
          <MaskedScroll fadeSize={16}>
            {options.map((option, index) =>
              <SelectMenuOption
                key={option.value}
                value={option.value}
                label={option.label}
                accessoryStart={option.accessoryStart}
                accessoryEnd={option.accessoryEnd}
                note={option.note}
                isHighlighted={
                  index === selectedOptionIndex ||
                  (selectedOptionIndex === undefined && index === 0)}
                isSelected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setSelectedOptionIndex(index)}
                onMouseLeave={() => setSelectedOptionIndex(undefined)}
              />)}
          </MaskedScroll>
        </div>}
    </div>
  </div>;
}
