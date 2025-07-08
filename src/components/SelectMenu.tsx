import { AnnotatedTag } from '@/photo/form';
import { convertStringToArray, parameterize } from '@/utility/string';
import { clsx } from 'clsx/lite';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import MaskedScroll from './MaskedScroll';

const KEY_KEYDOWN = 'keydown';
const CREATE_LABEL = 'Create';

const ariaIdControl = (name: string) => `${name}-select-menu-control`;
const ariaIdOptions = (name: string) => `${name}-select-menu-options`;

export default function SelectMenu({
  name,
  value = '',
  options = [],
  defaultIcon,
  onChange,
  showMenuOnDelete,
  className,
  readOnly,
  limit,
}: {
  name: string
  value?: string
  options?: AnnotatedTag[]
  defaultIcon?: ReactNode
  onChange?: (value: string) => void
  showMenuOnDelete?: boolean
  className?: string
  readOnly?: boolean
  placeholder?: string
  limit?: number
  limitValidationMessage?: string
}) {
  const containerRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const [shouldShowMenu, setShouldShowMenu] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>();

  const selectedOptions = useMemo(() =>
    convertStringToArray(value) ?? []
  , [value]);

  const hideMenu = useCallback(() => {
    setShouldShowMenu(false);
    setSelectedOptionIndex(undefined);
  }, []);

  const addOptions = useCallback((options: (string | undefined)[]) => {
    const optionsToAdd = (options
      .filter(Boolean) as string[])
      .map(option => option.startsWith(CREATE_LABEL)
        ? option.match(new RegExp(`^${CREATE_LABEL} "(.+)"$`))?.[1] ?? option
        : option)
      .map(option => parameterize(option))
      .filter(option => !selectedOptions.includes(option));

    if (optionsToAdd.length > 0) {
      onChange?.([
        ...selectedOptions,
        ...optionsToAdd,
      ].join(','));
    }

    setSelectedOptionIndex(undefined);

    if (
      (limit !== undefined && limit - 1 >= selectedOptions.length)
    ) {
      hideMenu();
    }
  }, [limit, selectedOptions, onChange, hideMenu]);

  const removeOption = useCallback((option: string) => {
    onChange?.(selectedOptions.filter(o =>
      o !== parameterize(option)).join(','));
    setSelectedOptionIndex(undefined);
  }, [onChange, selectedOptions]);

  // Focus option in the DOM when selected index changes
  useEffect(() => {
    if (selectedOptionIndex !== undefined) {
      const options = optionsRef.current?.querySelectorAll(':scope > div');
      const option = options?.[selectedOptionIndex] as HTMLElement | undefined;
      option?.focus();
    }
  }, [selectedOptionIndex]);

  // Setup keyboard listener
  useEffect(() => {
    const ref = containerRef.current;

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
      case 'Enter':
        // Only trap focus if there are options to select
        // otherwise allow form to submit
        if (shouldShowMenu) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
        break;
      case 'ArrowDown':
        if (shouldShowMenu) {
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
          setShouldShowMenu(true);
        }
        break;
      case 'ArrowUp':
        setSelectedOptionIndex(i => {
          if (
            options.length > 0
          ) {
            return options.length - 1;
          } else if (i === undefined || i === 0) {
            return undefined;
          } else {
            return i - 1;
          }
        });
        break;
      case 'Escape':
        hideMenu();
        break;
      }
    };

    ref?.addEventListener(KEY_KEYDOWN, listener);

    return () => ref?.removeEventListener(KEY_KEYDOWN, listener);
  }, [
    removeOption,
    showMenuOnDelete,
    hideMenu,
    selectedOptions,
    selectedOptionIndex,
    addOptions,
    shouldShowMenu,
    limit,
    options.length,
  ]);

  const renderTag = useCallback((value: string) => {
    const option = options.find(o => o.value === value);
    const icon = option?.icon ?? defaultIcon;
    return <>
      <span className="truncate">
        {option?.label ?? value}
      </span>
      {icon && <span className="text-medium">
        {icon}
      </span>}
    </>;
  }, [options, defaultIcon]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full group"
      onFocus={() => setShouldShowMenu(true)}
    >
      <div
        id={ariaIdControl(name)}
        role="region"
        aria-live="polite"
        className="sr-only mb-3 text-dim"
      >
        {selectedOptions.length === 0
          ? 'No tags selected'
          : selectedOptions.join(', ') +
            ` tag${selectedOptions.length !== 1 ? 's' : ''} selected`}
      </div>
      <div
        aria-controls={ariaIdControl(name)}
        className={clsx(
          className,
          'w-full control px-2! py-2!',
          '-outline-offset-2 outline-blue-600',
          'group-focus-within:outline-2 ',
          'inline-flex flex-wrap items-center gap-2',
          readOnly && 'cursor-not-allowed',
          readOnly && 'bg-gray-100 dark:bg-gray-900 dark:text-gray-400',
        )}
      >
        {/* Selected Options */}
        {selectedOptions
          .filter(Boolean)
          .map(option =>
            <span
              key={option}
              role="button"
              aria-label={`Remove tag "${option}"`}
              className={clsx(
                'inline-flex items-center gap-2 min-w-0',
                'text-main',
                'cursor-pointer select-none',
                'whitespace-nowrap',
                'px-1.5 py-0.5',
                'bg-gray-200/60 dark:bg-gray-800',
                'active:bg-gray-200 dark:active:bg-gray-900',
                'rounded-xs',
              )}
              onClick={() => removeOption(option)}
            >
              {renderTag(option)}
            </span>)}
      </div>
      <div className="relative">
        {shouldShowMenu && options.length > 0 &&
          <div
            className={clsx(
              'component-surface',
              'absolute top-3 w-full px-1.5 py-1.5',
              'max-h-[8rem] overflow-y-auto flex flex-col',
              'shadow-lg dark:shadow-xl',
            )}
          >
            <MaskedScroll
              id={ariaIdOptions(name)}
              role="listbox"
              className="flex flex-col gap-y-1 text-xl"
              ref={optionsRef}
              fadeSize={16}
            >
              {/* Menu Options */}
              {options.map(({
                value,
                annotation,
                annotationAria,
              }, index) =>
                <div
                  key={value}
                  role="option"
                  aria-selected={
                    index === selectedOptionIndex ||
                    (index === 0 && selectedOptionIndex === undefined)
                  }
                  tabIndex={0}
                  className={clsx(
                    'group flex items-center gap-2',
                    'px-1.5 py-1 rounded-sm',
                    'text-base select-none',
                    'cursor-pointer',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'active:bg-gray-50 dark:active:bg-gray-900',
                    'focus:bg-gray-100 dark:focus:bg-gray-800',
                    index === 0 && selectedOptionIndex === undefined &&
                      'bg-gray-100 dark:bg-gray-800',
                    'outline-hidden',
                  )}
                  onClick={() => {
                    addOptions([value]);
                  }}
                  onFocus={() => setSelectedOptionIndex(index)}
                >
                  <span className="grow inline-flex items-center gap-2 min-w-0">
                    {renderTag(value)}
                  </span>
                  {annotation &&
                    <span
                      className="whitespace-nowrap text-dim text-sm"
                      aria-label={annotationAria}
                    >
                      <span aria-hidden={Boolean(annotationAria)}>
                        {annotation}
                      </span>
                    </span>}
                </div>)}
            </MaskedScroll>
          </div>}
      </div>
    </div>
  );
}
