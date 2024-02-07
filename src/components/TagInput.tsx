import { AnnotatedTag } from '@/photo/form';
import { convertStringToArray, parameterize } from '@/utility/string';
import { clsx } from 'clsx/lite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const KEY_KEYDOWN = 'keydown';
const CREATE_LABEL = 'Create';

export default function TagInput({
  name,
  value = '',
  options = [],
  onChange,
  className,
  readOnly,
}: {
  name: string
  value?: string
  options?: AnnotatedTag[]
  onChange?: (value: string) => void
  className?: string
  readOnly?: boolean
}) {
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

  const inputTextFormatted = parameterize(inputText);
  const isInputTextUnique =
    inputTextFormatted &&
    !optionValues.includes(inputTextFormatted) &&
    !selectedOptions.includes(inputTextFormatted);

  const optionsFiltered = useMemo<AnnotatedTag[]>(() =>
    (isInputTextUnique
      ? [{ value: `${CREATE_LABEL} "${inputTextFormatted}"` }]
      : []
    ).concat(options
      .filter(({ value }) =>
        !selectedOptions.includes(value) &&
        (
          !inputTextFormatted ||
          value.includes(inputTextFormatted)
        )))
  , [inputTextFormatted, isInputTextUnique, options, selectedOptions]);

  const hideMenu = useCallback((shouldBlurInput?: boolean) => {
    setShouldShowMenu(false);
    setSelectedOptionIndex(undefined);
    if (shouldBlurInput) {
      inputRef.current?.blur();
    }
  }, []);

  const addOption = useCallback((option?: string) => {
    if (option && !selectedOptions.includes(option)) {
      onChange?.([
        ...selectedOptions,
        option.startsWith(CREATE_LABEL)
          ? option.slice(CREATE_LABEL.length, -1)
          : option,
      ]
        .filter(Boolean)
        .map(parameterize)
        .join(','));
    }
    setSelectedOptionIndex(undefined);
    inputRef.current?.focus();
  }, [onChange, selectedOptions]);

  const removeOption = useCallback((option: string) => {
    onChange?.(selectedOptions.filter(o =>
      o !== parameterize(option)).join(','));
    setSelectedOptionIndex(undefined);
    inputRef.current?.focus();
  }, [onChange, selectedOptions]);

  // Show options when input text changes
  useEffect(() => {
    if (inputText) {
      setShouldShowMenu(true);
    }
  }, [inputText]);

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
      case ',':
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
        if (optionsFiltered.length > 0) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
        addOption(optionsFiltered[selectedOptionIndex ?? 0].value);
        setInputText('');
        break;
      case ',':
        addOption(inputText);
        setInputText('');
        break;
      case 'ArrowDown':
        setSelectedOptionIndex(i => {
          if (i === undefined) {
            return 1;
          } else if (i >= optionsFiltered.length - 1) {
            return 0;
          } else {
            return i + 1;
          }
        });
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
          hideMenu();
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
    hideMenu,
    selectedOptions,
    selectedOptionIndex,
    optionsFiltered,
    addOption,
  ]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full group"
      onFocus={() => setShouldShowMenu(true)}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          hideMenu();
        }
      }}
    >
      <div className={clsx(
        className,
        'w-full control !px-2 !py-2',
        'group-focus-within:outline outline-1 outline-blue-600',
        'inline-flex flex-wrap items-center gap-2',
        readOnly && 'cursor-not-allowed',
        readOnly && 'bg-gray-100 dark:bg-gray-900 dark:text-gray-400',
      )}>
        {selectedOptions
          .filter(Boolean)
          .map(option =>
            <span
              key={option}
              className={clsx(
                'cursor-pointer select-none',
                'whitespace-nowrap',
                'px-1.5 py-0.5',
                'bg-gray-200/60 dark:bg-gray-800',
                'active:bg-gray-200 dark:active:bg-gray-900',
                'rounded-sm',
              )}
              onClick={() => removeOption(option)}
            >
              {option}
            </span>)}
        <input
          ref={inputRef}
          type="text"
          className={clsx(
            'grow !min-w-0 !p-0 -my-2 text-xl',
            '!border-none !ring-transparent',
          )}
          size={10}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          readOnly={readOnly}
          onFocus={() => setSelectedOptionIndex(undefined)}
        />
        <input type="hidden" name={name} value={value} />
      </div>
      <div className="relative">
        <div
          ref={optionsRef}
          className={clsx(
            !(shouldShowMenu && optionsFiltered.length > 0) && 'hidden',
            'control absolute top-0 mt-3 w-full z-10 !px-1.5 !py-1.5',
            'max-h-[8rem] overflow-y-auto',
            'flex flex-col gap-y-1',
            'text-xl shadow-lg dark:shadow-xl',
          )}
        >
          {optionsFiltered.map(({ value, annotation }, index) =>
            <div
              key={value}
              tabIndex={0}
              className={clsx(
                'group flex items-center gap-1',
                'cursor-pointer select-none',
                'px-1.5 py-1 rounded-sm',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'active:bg-gray-50 dark:active:bg-gray-900',
                'focus:bg-gray-100 dark:focus:bg-gray-800',
                index === 0 && selectedOptionIndex === undefined &&
                  'bg-gray-100 dark:bg-gray-800',
                'outline-none',
              )}
              onClick={() => {
                addOption(value);
                setInputText('');
              }}
              onFocus={() => setSelectedOptionIndex(index)}
            >
              <span className="grow min-w-0 truncate">
                {value}
              </span>
              {annotation &&
                <span className={clsx(
                  'whitespace-nowrap text-dim text-sm',
                  'group-focus:inline-block group-hover:inline-block',
                  index === 0 && selectedOptionIndex === undefined
                    ? 'inline-block'
                    : 'hidden',
                )}>
                  {annotation}
                </span>}
            </div>)}
        </div>
      </div>
    </div>
  );
}
