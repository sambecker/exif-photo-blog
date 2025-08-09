import clsx from 'clsx/lite';
import { ReactNode, useEffect, useRef, useState } from 'react';
import MaskedScroll from './MaskedScroll';
import useClickInsideOutside from '@/utility/useClickInsideOutside';
import IconSelectChevron from './icons/IconSelectChevron';
import SelectMenuOption, { SelectMenuOptionType } from './SelectMenuOption';

const LISTENER_KEY_MOUSE_MOVE = 'mousemove';
const LISTENER_KEY_KEYDOWN = 'keydown';

export default function SelectMenu({
  id,
  name,
  value,
  className,
  onChange,
  options,
  defaultOptionLabel,
  tabIndex = 0,
  error,
  readOnly,
  children,
}: {
  id?: string
  name: string
  value: string
  className?: string
  onChange?: (value: string) => void
  options: SelectMenuOptionType[]
  defaultOptionLabel?: string
  tabIndex?: number
  error?: string
  readOnly?: boolean
  children?: ReactNode
}) {
  const ARIA_ID_SELECT_OPTIONS = `select-options-${name}`;

  const ref = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>();
  const [shouldHighlightOnHover, setShouldHighlightOnHover] = useState(true);

  const selectedOption = options.find(o => o.value === value);

  useClickInsideOutside({
    htmlElements: [ref],
    onClickOutside: () => setIsOpen(false),
  });

  useEffect(() => {
    if (readOnly) {
      setIsOpen(false);
    }
  }, [readOnly]);

  // Setup keyboard listener
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      // Keys which always trap focus
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
        case 'Escape':
          setShouldHighlightOnHover(false);
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
            setSelectedOptionIndex(0);
          }
          break;
        case 'ArrowUp':
          if (isOpen) {
            setSelectedOptionIndex((i = 0) => {
              if (options.length > 1) {
                if (i === 0) {
                  return options.length - 1;
                } else {
                  return i - 1;
                }
              }
            });
          } else {
            setIsOpen(true);
            setSelectedOptionIndex(Math.max(0, options.length - 1));
          }
          break;
        case 'Enter':
          if (isOpen) {
            if (selectedOptionIndex !== undefined) {
              onChange?.(options[selectedOptionIndex].value);
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
    refRef?.addEventListener(LISTENER_KEY_KEYDOWN, listener);
    return () => refRef?.removeEventListener(LISTENER_KEY_KEYDOWN, listener);
  }, [
    isOpen,
    options,
    selectedOptionIndex,
    onChange,
  ]);

  useEffect(() => {
    const onMouseMove = () => {
      setShouldHighlightOnHover(true);
    };
    const refRef = ref.current;
    refRef?.addEventListener(LISTENER_KEY_MOUSE_MOVE, onMouseMove);
    return () =>
      refRef?.removeEventListener(LISTENER_KEY_MOUSE_MOVE, onMouseMove);
  }, []);

  return (
    <div ref={ref} className={className}>
      <div
        tabIndex={tabIndex}
        className={clsx(
          'cursor-pointer control pl-1.5 py-2',
          'flex items-center w-full h-10',
          'focus:outline-2 -outline-offset-2 focus:outline-blue-600',
          'select-none',
          Boolean(error) && 'error',
          readOnly && 'disabled-select',
        )}
        onMouseDown={() => setIsOpen(o => !o)}
        onFocus={() => setIsOpen(true)}
        onBlur={e => {
          if (e.relatedTarget && !ref.current?.contains(e.relatedTarget)) {
            setIsOpen(false);
          }
        }}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={isOpen ? ARIA_ID_SELECT_OPTIONS : undefined}
        role="combobox"
      >
        {children ?? <div className="flex items-center w-full">
          <div className="grow min-w-0">
            <SelectMenuOption
              className="text-lg"
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
        <input id={id} type="hidden" name={name} value={value} />
      </div>
      <div className="relative">
        {isOpen &&
          <div
            className={clsx(
              'component-surface z-1',
              'absolute top-3 w-full px-1.5 py-1.5',
              'max-h-[12rem] overflow-y-auto flex flex-col',
              'shadow-lg dark:shadow-xl',
              'animate-fade-in-from-top',
              '*:select-none',
            )}
          >
            <MaskedScroll
              id={ARIA_ID_SELECT_OPTIONS}
              role="listbox"
              className="flex flex-col gap-1"
              fadeSize={16}
            >
              {defaultOptionLabel &&
                <SelectMenuOption value="" label={defaultOptionLabel} />}
              {options.map((option, index) =>
                <SelectMenuOption
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  accessoryStart={option.accessoryStart}
                  accessoryEnd={option.accessoryEnd}
                  note={option.note}
                  isSelected={option.value === value}
                  isHighlighted={
                    index === selectedOptionIndex ||
                    (selectedOptionIndex === undefined && index === 0)}
                  shouldHighlightOnHover={shouldHighlightOnHover}
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                />)}
            </MaskedScroll>
          </div>}
      </div>
    </div>
  );
}
