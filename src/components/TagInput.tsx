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
const KEY_KEYDOWN = 'keydown';
const CREATE_LABEL = 'Create';

const ARIA_ID_TAG_CONTROL = 'tag-control';
const ARIA_ID_TAG_OPTIONS = 'tag-options';

export default function TagInput({
  id,
  name,
  value = '',
  options = [],
  defaultIcon,
  onChange,
  showMenuOnDelete,
  className,
  readOnly,
  placeholder,
  limit,
  limitValidationMessage,
}: {
  id?: string
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
  const behaveAsDropdown = limit === 1;

  const containerRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLInputElement>(null);

  const [shouldShowMenu, setShouldShowMenu] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>();

  const optionValues = useMemo(() =>
    options.map(({ value }) => value)
  , [options]);

  const selectedOptions = useMemo(() =>
    convertStringToArray(value) ?? []
  , [value]);

  const hasReachedLimit = useMemo(() =>
    limit !== undefined &&
    selectedOptions.length >= limit &&
    !behaveAsDropdown
  , [limit, behaveAsDropdown, selectedOptions]);

  const inputTextFormatted = parameterize(inputText);
  const isInputTextUnique =
    inputTextFormatted &&
    !optionValues.includes(inputTextFormatted) &&
    !selectedOptions.includes(inputTextFormatted);

  const optionsFiltered = useMemo<AnnotatedTag[]>(() => hasReachedLimit
    ? [{ value: limitValidationMessage ?? `Tag limit reached (${limit})` }]
    : (isInputTextUnique
      ? [{ value: `${CREATE_LABEL} "${inputTextFormatted}"` }]
      : []
    ).concat(options
      .filter(({ value }) =>
        !selectedOptions.includes(value) &&
        (
          !inputTextFormatted ||
          value.includes(inputTextFormatted)
        )))
  , [
    hasReachedLimit,
    inputTextFormatted,
    isInputTextUnique,
    limit,
    limitValidationMessage,
    options,
    selectedOptions,
  ]);

  const hideMenu = useCallback((shouldBlurInput?: boolean) => {
    setShouldShowMenu(false);
    setSelectedOptionIndex(undefined);
    if (shouldBlurInput) {
      inputRef.current?.blur();
    }
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
      if (behaveAsDropdown) {
        // If behaving as dropdown, replace contents on add
        onChange?.(optionsToAdd[0]);
      } else {
        onChange?.([
          ...selectedOptions,
          ...optionsToAdd,
        ].join(','));
      }
    }

    setSelectedOptionIndex(undefined);
    setInputText('');

    if (
      behaveAsDropdown ||
      (limit !== undefined && limit - 1 >= selectedOptions.length)
    ) {
      hideMenu(true);
    } else {
      inputRef.current?.focus();
    }
  }, [limit, behaveAsDropdown, selectedOptions, onChange, hideMenu]);

  const removeOption = useCallback((option: string) => {
    onChange?.(selectedOptions.filter(o =>
      o !== parameterize(option)).join(','));
    setSelectedOptionIndex(undefined);
    inputRef.current?.focus();
  }, [onChange, selectedOptions]);

  // Show options when input text changes
  useEffect(() => {
    if (inputText) {
      if (inputText.includes(',')) {
        addOptions(inputText.split(','));
      } else {
        setShouldShowMenu(true);
      }
    }
  }, [inputText, addOptions, selectedOptions]);

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
        if (
          shouldShowMenu &&
          optionsFiltered.length > 0
        ) {
          e.stopImmediatePropagation();
          e.preventDefault();
          if (!hasReachedLimit) {
            addOptions([optionsFiltered[selectedOptionIndex ?? 0].value]);
          }
        }
        break;
      case 'ArrowDown':
        if (shouldShowMenu) {
          setSelectedOptionIndex(i => {
            if (i === undefined) {
              return optionsFiltered.length > 1 ? 1 : 0;
            } else if (i >= optionsFiltered.length - 1) {
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
            document.activeElement === inputRef.current &&
            optionsFiltered.length > 0
          ) {
            return optionsFiltered.length - 1;
          } else if (i === undefined || i === 0) {
            inputRef.current?.focus();
            return undefined;
          } else {
            return i - 1;
          }
        });
        break;
      case 'Backspace':
        if (inputText === '' && selectedOptions.length > 0) {
          removeOption(selectedOptions[selectedOptions.length - 1]);
          if (!showMenuOnDelete) {
            hideMenu();
          }
        }
        break;
      case 'Escape':
        hideMenu(true);
        break;
      }
    };

    ref?.addEventListener(KEY_KEYDOWN, listener);

    return () => ref?.removeEventListener(KEY_KEYDOWN, listener);
  }, [
    inputText,
    removeOption,
    showMenuOnDelete,
    hideMenu,
    selectedOptions,
    selectedOptionIndex,
    optionsFiltered,
    addOptions,
    shouldShowMenu,
    hasReachedLimit,
    limit,
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
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Capture text on blur if limit not yet reached
          if (inputText && !hasReachedLimit) {
            addOptions([inputText]);
          } else {
            setInputText('');
          }
          hideMenu();
        }
      }}
    >
      <div
        id={ARIA_ID_TAG_CONTROL}
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
        aria-controls={ARIA_ID_TAG_CONTROL}
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
        <input
          id={id}
          ref={inputRef}
          type="text"
          className={clsx(
            'grow min-w-0! p-0! -my-2',
            'outline-hidden border-none',
            'placeholder:text-dim placeholder:text-[14px]',
            'placeholder:translate-x-[2px]',
            'placeholder:translate-y-[-1.5px]',
          )}
          size={10}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          readOnly={readOnly}
          placeholder={selectedOptions.length === 0 ? placeholder : undefined}
          onFocus={() => setSelectedOptionIndex(undefined)}
          onClick={() => {
            if (!shouldShowMenu) { setShouldShowMenu(true); }
          }}
          aria-autocomplete="list"
          aria-expanded={shouldShowMenu}
          aria-haspopup="true"
          aria-controls={shouldShowMenu ? ARIA_ID_TAG_OPTIONS : undefined}
          role="combobox"
        />
        <input type="hidden" name={name} value={value} />
      </div>
      {shouldShowMenu && optionsFiltered.length > 0 &&
        <div className="relative">
          <div
            id={ARIA_ID_TAG_OPTIONS}
            role="listbox"
            ref={optionsRef}
            className={clsx(
              'control absolute top-0 mt-3 w-full z-10 px-1.5! py-1.5!',
              'max-h-[8rem] overflow-y-auto',
              'flex flex-col gap-y-1',
              'text-xl shadow-lg dark:shadow-xl',
            )}
          >
            {/* Menu Options */}
            {optionsFiltered.map(({
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
                  'px-1.5 py-1 rounded-xs',
                  'text-base select-none',
                  hasReachedLimit ? 'cursor-not-allowed' : 'cursor-pointer',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  !hasReachedLimit &&
                    'active:bg-gray-50 dark:active:bg-gray-900',
                  'focus:bg-gray-100 dark:focus:bg-gray-800',
                  index === 0 && selectedOptionIndex === undefined &&
                    'bg-gray-100 dark:bg-gray-800',
                  'outline-hidden',
                )}
                onClick={() => {
                  if (!hasReachedLimit) {
                    addOptions([value]);
                  }
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
          </div>
        </div>}
    </div>
  );
}
