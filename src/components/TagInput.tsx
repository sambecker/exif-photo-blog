import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

const KEYDOWN_KEY = 'keydown';

const CREATE_LABEL = 'Create ';

export default function TagInput({
  options = [],
  selectedOptions = [],
  onChange,
  readOnly,
}: {
  options?: string[]
  selectedOptions?: string[]
  onChange?: (options: string[]) => void
  readOnly?: boolean
}) {
  const containerRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLInputElement>(null);

  const [hasFocus, setHasFocus] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>();

  const inputTextFormatted = inputText.toLocaleLowerCase().trim();
  const isInputTextNew =
    inputTextFormatted &&
    !selectedOptions.includes(inputTextFormatted);

  let optionsFiltered = options
    .filter(option =>
      !selectedOptions.includes(option) &&
      (
        !inputTextFormatted ||
        option.includes(inputTextFormatted)
      ));

  if (isInputTextNew) {
    optionsFiltered = [
      `${CREATE_LABEL}"${inputTextFormatted}"`,
      ...optionsFiltered,
    ];
  }

  const addOption = useCallback((option: string) => {
    onChange?.([
      ...selectedOptions,
      option.startsWith(CREATE_LABEL)
        ? option.slice(CREATE_LABEL.length + 1, -1)
        : option,
    ]
      .filter(Boolean)
      .map(option => option.toLocaleLowerCase().trim()));
    setSelectedOptionIndex(undefined);
  }, [onChange, selectedOptions]);

  useEffect(() => {
    if (!hasFocus) { setSelectedOptionIndex(undefined); }
  }, [hasFocus]);

  useEffect(() => {
    if (selectedOptionIndex !== undefined) {
      const ref = optionsRef.current;
      const options = ref?.querySelectorAll('div');
      const option = options?.[selectedOptionIndex] as HTMLElement | undefined;
      console.log({options, option: option?.innerHTML});
      option?.focus();
    }
  }, [selectedOptionIndex]);

  useEffect(() => {
    const ref = containerRef.current;
    const listener = (e: KeyboardEvent) => {
      switch (e.key) {
      case 'Enter':
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Escape':
        e.stopImmediatePropagation();
        e.preventDefault();
      }
      switch (e.key) {
      case 'Enter':
        addOption(optionsFiltered[selectedOptionIndex ?? 0]);
        inputRef.current?.focus();
        setInputText('');
        break;
      case 'ArrowDown':
        setSelectedOptionIndex(i => {
          if (i === undefined || i >= optionsFiltered.length - 1) {
            return 0;
          } else {
            return i + 1;
          }
        });
        break;
      case 'ArrowUp':
        setSelectedOptionIndex(i => {
          if (i === undefined || i === 0) {
            return optionsFiltered.length - 1;
          } else {
            return i - 1;
          }
        });
        break;
      case 'Backspace':
        if (inputText === '') {
          onChange?.(selectedOptions.slice(0, -1));
          // setHasFocus(false);
        }
        break;
      case 'Escape':
        setHasFocus(false);
        break;
      }
    };
    ref?.addEventListener(KEYDOWN_KEY, listener);
    return () => ref?.removeEventListener(KEYDOWN_KEY, listener);
  }, [
    inputText,
    onChange,
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
      <div className="w-full control !py-0 inline-flex items-center gap-2">
        {selectedOptions
          .filter(Boolean)
          .map(option =>
            <span
              key={option}
              className={clsx(
                'cursor-pointer',
                'whitespace-nowrap',
                'px-1.5 py-0.5',
                'bg-gray-100 dark:bg-gray-800',
                'rounded-sm',
              )}
              onClick={() =>
                onChange?.(selectedOptions.filter(o => o !== option))}
            >
              {option}
            </span>)}
        <input
          ref={inputRef}
          type="text"
          className={clsx(
            'grow !min-w-0 !p-0',
            '!border-none !ring-transparent',
          )}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          readOnly={readOnly}
        />
      </div>
      <div className="relative">
        {hasFocus && optionsFiltered.length > 0 &&
          <div
            tabIndex={0}
            ref={optionsRef}
            className={clsx(
              'control absolute top-0 mt-4 w-full z-10 !px-1.5 !py-1.5',
              'text-xl',
              'shadow-xl',
            )}
          >
            {optionsFiltered.map((option, index) =>
              <div
                key={option}
                className={clsx(
                  'cursor-pointer',
                  'px-1 py-1 rounded-sm',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'focus:bg-gray-100 dark:focus:bg-gray-800',
                  'focus:border-none focus:ring-transparent',
                )}
                tabIndex={index + 1}
                onClick={() => {
                  addOption(option);
                  inputRef.current?.focus();
                  setInputText('');
                  // setHasFocus(false);
                }}
              >
                {option}
              </div>)}
          </div>}
      </div>
    </div>
  );
}
