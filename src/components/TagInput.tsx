import { convertStringToArray, parameterize } from '@/utility/string';
import { clsx } from 'clsx/lite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const KEYDOWN_KEY = 'keydown';
const CREATE_LABEL = 'Create ';

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
  options?: string[]
  onChange?: (value: string) => void
  className?: string
  readOnly?: boolean
}) {
  const containerRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLInputElement>(null);

  const [hasFocus, setHasFocus] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>();

  const selectedOptions = useMemo(() =>
    convertStringToArray(value) ?? []
  , [value]);

  const inputTextFormatted = parameterize(inputText);
  const isInputTextUnique =
    inputTextFormatted &&
    !options.includes(inputTextFormatted) &&
    !selectedOptions.includes(inputTextFormatted);

  const optionsFiltered = (isInputTextUnique
    ? [`${CREATE_LABEL}"${inputTextFormatted}"`]
    : []).concat(options
    .filter(option =>
      !selectedOptions.includes(option) &&
      (
        !inputTextFormatted ||
        option.includes(inputTextFormatted)
      )));

  const addOption = useCallback((option?: string) => {
    if (option && !selectedOptions.includes(option)) {
      onChange?.([
        ...selectedOptions,
        option.startsWith(CREATE_LABEL)
          ? option.slice(CREATE_LABEL.length + 1, -1)
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
    onChange?.(selectedOptions.filter(o => o !== option).join(','));
    setSelectedOptionIndex(undefined);
    inputRef.current?.focus();
  }, [onChange, selectedOptions]);

  // Reset selected option index when focus is lost
  useEffect(() => {
    if (!hasFocus) { setSelectedOptionIndex(undefined); }
  }, [hasFocus]);

  // Focus option in the DOM when selected index changes
  useEffect(() => {
    const options = optionsRef.current?.querySelectorAll('div');
    if (selectedOptionIndex !== undefined) {
      const option = options?.[selectedOptionIndex] as HTMLElement | undefined;
      option?.focus();
    } else {
      inputRef.current?.focus();
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
        addOption(optionsFiltered[selectedOptionIndex ?? 0]);
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
          if (i === undefined || i === 0) {
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
        }
        break;
      case 'Escape':
        inputRef.current?.blur();
        setHasFocus(false);
        break;
      }
    };
    ref?.addEventListener(KEYDOWN_KEY, listener);
    return () => ref?.removeEventListener(KEYDOWN_KEY, listener);
  }, [
    inputText,
    removeOption,
    hasFocus,
    selectedOptions,
    selectedOptionIndex,
    optionsFiltered,
    addOption,
  ]);

  return (
    <div
      ref={containerRef}
      className="w-full"
      onFocus={() => setHasFocus(true)}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setHasFocus(false);
          setSelectedOptionIndex(undefined);
        }
      }}
    >
      <div className={clsx(
        className,
        'w-full control !py-2',
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
                'bg-gray-100 dark:bg-gray-800',
                'active:bg-gray-50 dark:active:bg-gray-900',
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
        />
        <input type="hidden" name={name} value={value} />
      </div>
      <div className="relative min-h-0">
        <div
          ref={optionsRef}
          className={clsx(
            !(hasFocus && optionsFiltered.length > 0) && 'hidden',
            'control absolute top-0 mt-4 w-full z-10 !px-1.5 !py-1.5',
            'max-h-[7.5rem] overflow-y-auto',
            'flex flex-col gap-y-1',
            'text-xl shadow-lg dark:shadow-xl',
          )}
        >
          {optionsFiltered.map((option, index) =>
            <div
              key={option}
              tabIndex={0}
              className={clsx(
                'cursor-pointer select-none',
                'px-1 py-1 rounded-sm',
                index === 0 && selectedOptionIndex === undefined &&
                  'bg-gray-100 dark:bg-gray-800',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'active:bg-gray-50 dark:active:bg-gray-900',
                'focus:bg-gray-100 dark:focus:bg-gray-800',
                'outline-none',
              )}
              onClick={() => {
                addOption(option);
                setInputText('');
              }}
            >
              {option}
            </div>)}
        </div>
      </div>
    </div>
  );
}
