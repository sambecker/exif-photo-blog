import clsx from 'clsx/lite';
import { SelectHTMLAttributes, useRef, useState } from 'react';
import MaskedScroll from './MaskedScroll';
import useClickInsideOutside from '@/utility/useClickInsideOutside';
import IconSelectChevron from './icons/IconSelectChevron';

export type Option = {
  value: string
  label: string
  icon?: string
  note?: string
}

export default function SelectInput({
  options,
  className,
  ...props
}: {
  options: Option[]
} & SelectHTMLAttributes<HTMLSelectElement>) {
  const refSelect = useRef<HTMLSelectElement>(null);

  const refContainer = useRef<HTMLDivElement>(null);
  const refMenu = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  useClickInsideOutside({
    htmlElements: [refContainer, refSelect, refMenu],
    onClickOutside: () => setIsOpen(false),
  });

  return (
    <div className={clsx('relative', className)}>
      <select
        {...props}
        ref={refSelect}
        className="absolute inset-0 opacity-0!"
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="absolute inset-0 *:select-none">
        <div
          ref={refContainer}
          className={clsx(
            'control text-lg flex items-center gap-2',
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="grow">{props.value}</div>
          <IconSelectChevron />
        </div>
        {isOpen &&
          <div
            ref={refMenu}
            className={clsx(
              'component-surface z-10',
              'absolute top-12 w-full px-1.5 py-1.5',
              'max-h-[7rem] overflow-y-auto flex flex-col',
              'shadow-lg dark:shadow-xl',
            )}
          >
            <MaskedScroll
              role="listbox"
              className="flex flex-col text-lg"
              fadeSize={16}
            >
              {options.map(({ value, label }) => (
                <div
                  key={value}
                  className={clsx(
                    'group flex items-center gap-2',
                    'px-1.5 py-1 rounded-sm',
                    'text-lg ',
                    'cursor-pointer',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'active:bg-gray-50 dark:active:bg-gray-900',
                    'focus:bg-gray-100 dark:focus:bg-gray-800',
                    'outline-hidden',
                  )}
                  onClick={() => {
                    if (refSelect.current) {
                      refSelect.current.value = value;
                      refSelect.current.dispatchEvent(new Event('change'));
                    }
                    setIsOpen(false);
                  }}
                >
                  {label}
                </div>
              ))}
            </MaskedScroll>
          </div>}
      </div>
    </div>
  );
}
