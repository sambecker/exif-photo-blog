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

const ARIA_ID_TAG_CONTROL = 'tag-control';
const ARIA_ID_TAG_OPTIONS = 'tag-options';

export default function TagInput({
  id,
  name,
  value = '',
  options = [],
  labelForValueOverride,
  defaultIcon,
  defaultIconSelected,
  accessory,
  onChange,
  onInputTextChange,
  className,
  readOnly,
  placeholder,
  limit,
  limitValidationMessage,
  allowNewValues = true,
  shouldParameterize,
  shouldRevealRawText,
}: {
  id?: string
  name: string
  value?: string
  options?: AnnotatedTag[]
  labelForValueOverride?: (value: string) => string | undefined
  defaultIcon?: ReactNode
  defaultIconSelected?: ReactNode
  accessory?: ReactNode
  onChange?: (value: string) => void
  onInputTextChange?: (value: string) => void
  className?: string
  readOnly?: boolean
  placeholder?: string
  limit?: number
  limitValidationMessage?: string
  allowNewValues?: boolean
  shouldParameterize?: boolean
  shouldRevealRawText?: boolean
}) {
  const behavesAsDropdown = limit === 1;

  const containerRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const [shouldShowMenu, setShouldShowMenu] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isRevealingRawText, setIsRevealingRawText] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>();
  // Set when a suggestion is chosen so the following blur does not
  // write the in-progress query back over that choice.
  const ignoreRawTextCommitRef = useRef(false);
  const rawTextOnFocusRef = useRef<string>(null);

  const optionValues = useMemo(() =>
    options.map(({ value }) => value)
  , [options]);

  const selectedOptions = useMemo(() =>
    convertStringToArray(value, shouldParameterize, !behavesAsDropdown)
  , [value, behavesAsDropdown, shouldParameterize]);

  const hasReachedLimit = useMemo(() =>
    limit !== undefined &&
    selectedOptions.length >= limit &&
    !behavesAsDropdown
  , [limit, behavesAsDropdown, selectedOptions]);

  const inputTextFormatted = shouldParameterize
    ? parameterize(inputText)
    : inputText.trim();
  const isInputTextUnique = useMemo(() => {
    if (shouldParameterize) {
      // Check already-parameterized values
      return inputTextFormatted &&
      !optionValues.includes(inputTextFormatted) &&
      (
        isRevealingRawText ||
        !selectedOptions.includes(inputTextFormatted)
      );
    } else if (isRevealingRawText) {
      // Case-sensitive, so "nikon" can be created when "Nikon" exists
      return inputTextFormatted &&
        !optionValues.includes(inputTextFormatted);
    } else {
      // Parameterize for check only
      const inputTextParameterized = parameterize(inputTextFormatted);
      return inputTextFormatted &&
      !optionValues
        .map(value => parameterize(value))
        .includes((inputTextParameterized)) &&
      !selectedOptions
        .map(value => parameterize(value))
        .includes(inputTextParameterized);
    }
  }, [
    shouldParameterize,
    inputTextFormatted,
    optionValues,
    selectedOptions,
    isRevealingRawText,
  ]);

  const optionsFiltered = useMemo<AnnotatedTag[]>(() => hasReachedLimit
    ? [{ value: limitValidationMessage ?? `Limit reached (${limit})` }]
    : (isInputTextUnique && allowNewValues
      ? [{ value: `${CREATE_LABEL} "${inputTextFormatted}"` }]
      : []
    ).concat(options
      .filter(({ value, label }) =>{
        // Include label when it exists so both are searchable.
        const key = label ? `${value}-${label}` : value;
        // While raw text is showing, the committed value is stale until
        // blur, so keep that option searchable.
        return (isRevealingRawText || !selectedOptions.includes(key)) && (
          !inputTextFormatted ||
          (shouldParameterize
            ? key.includes(inputTextFormatted)
            : (parameterize(key)).includes(parameterize(inputTextFormatted)))
        );
      }))
  , [
    hasReachedLimit,
    inputTextFormatted,
    isInputTextUnique,
    allowNewValues,
    limit,
    limitValidationMessage,
    options,
    selectedOptions,
    isRevealingRawText,
    shouldParameterize,
  ]);

  const hideMenu = useCallback((shouldBlurInput?: boolean) => {
    setShouldShowMenu(false);
    setSelectedOptionIndex(undefined);
    if (shouldBlurInput) {
      inputRef.current?.blur();
    }
  }, []);

  const addOptions = useCallback((options: (string | undefined)[]) => {
    if (shouldRevealRawText) {
      ignoreRawTextCommitRef.current = true;
      setIsRevealingRawText(false);
    }

    const optionsToAdd = (options
      .filter(Boolean) as string[])
      .map(option => option.startsWith(CREATE_LABEL)
        ? option.match(new RegExp(`^${CREATE_LABEL} "(.+)"$`))?.[1] ?? option
        : option)
      .map(option => shouldParameterize
        ? parameterize(option)
        : option)
      .filter(option => !selectedOptions.includes(option));

    if (optionsToAdd.length > 0) {
      if (behavesAsDropdown) {
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
      behavesAsDropdown ||
      (limit !== undefined && limit - 1 >= selectedOptions.length)
    ) {
      hideMenu(true);
    } else {
      inputRef.current?.focus();
    }
  }, [
    limit,
    behavesAsDropdown,
    selectedOptions,
    shouldParameterize,
    shouldRevealRawText,
    onChange,
    hideMenu,
  ]);

  const removeOption = useCallback((option: string) => {
    const next = selectedOptions
      .filter(o => o !== (shouldParameterize ? parameterize(option) : option))
      .join(',');
    onChange?.(next);
    setSelectedOptionIndex(undefined);
    if (shouldRevealRawText) {
      rawTextOnFocusRef.current = next;
    }
    inputRef.current?.focus();
  }, [shouldParameterize, shouldRevealRawText, onChange, selectedOptions]);

  // Show options when input text changes.
  // Raw-text editing keeps commas in the field until blur.
  useEffect(() => {
    if (inputText && !(shouldRevealRawText && !isRevealingRawText)) {
      if (
        inputText.includes(',') &&
        !behavesAsDropdown &&
        !shouldRevealRawText
      ) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        addOptions(inputText.split(','));
      } else {
        setShouldShowMenu(true);
      }
    }
  }, [
    inputText,
    behavesAsDropdown,
    addOptions,
    selectedOptions,
    shouldRevealRawText,
    isRevealingRawText,
  ]);

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
          // otherwise allow form to submit.
          // With raw text visible, Enter keeps that text unless a
          // suggestion was highlighted with the arrow keys.
          if (
            shouldShowMenu &&
            optionsFiltered.length > 0 &&
            !(shouldRevealRawText && selectedOptionIndex === undefined)
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
                if (shouldRevealRawText) { return 0; }
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
          if (
            !isRevealingRawText &&
            inputText === '' &&
            selectedOptions.length > 0
          ) {
            removeOption(selectedOptions[selectedOptions.length - 1]);
            if (!behavesAsDropdown) { hideMenu(); }
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
    behavesAsDropdown,
    hideMenu,
    selectedOptions,
    selectedOptionIndex,
    optionsFiltered,
    addOptions,
    shouldShowMenu,
    shouldRevealRawText,
    isRevealingRawText,
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
      {icon && <span className="text-medium shrink-0">
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
          if (shouldRevealRawText) {
            if (
              isRevealingRawText &&
              !ignoreRawTextCommitRef.current &&
              !readOnly
            ) {
              const next = convertStringToArray(
                inputText,
                shouldParameterize,
                !behavesAsDropdown,
              ).join(',');
              if (next !== value) {
                onChange?.(next);
              }
            }
            ignoreRawTextCommitRef.current = false;
            setInputText('');
            setIsRevealingRawText(false);
          } else if (inputText && !hasReachedLimit && allowNewValues) {
            // Capture text on blur if limit not yet reached
            addOptions([inputText]);
          } else if (allowNewValues) {
            // Only clear text when there's the possibility of
            // explicity adding arbitrary values, i.e., when it's not
            // used as autocomplete
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
        {!(shouldRevealRawText && isRevealingRawText) && selectedOptions
          .filter(Boolean)
          .map(option =>
            <button
              key={option}
              type="button"
              aria-label={`Remove tag "${option}"`}
              className={clsx(
                'inline-flex items-center gap-2 min-w-0',
                'text-main',
                'cursor-pointer select-none',
                'whitespace-nowrap',
                'px-1.5 py-0.5',
                'bg-gray-200/60 dark:bg-gray-800',
                'active:bg-gray-200 dark:active:bg-gray-900',
                'rounded-sm',
                'border-none shadow-none',
              )}
              onClick={() => removeOption(option)}
            >
              {defaultIconSelected}
              {renderTag(labelForValueOverride?.(option) || option)}
            </button>)}
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
          onChange={e => {
            ignoreRawTextCommitRef.current = false;
            setInputText(e.target.value);
            onInputTextChange?.(e.target.value);
          }}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          readOnly={readOnly}
          placeholder={
            !isRevealingRawText && selectedOptions.length === 0
              ? placeholder
              : undefined
          }
          onFocus={() => {
            setSelectedOptionIndex(undefined);
            if (shouldRevealRawText && !isRevealingRawText) {
              const next = rawTextOnFocusRef.current ?? value;
              rawTextOnFocusRef.current = null;
              ignoreRawTextCommitRef.current = false;
              setInputText(next);
              setIsRevealingRawText(true);
            }
          }}
          onClick={() => {
            if (!shouldShowMenu) { setShouldShowMenu(true); }
          }}
          aria-autocomplete="list"
          aria-expanded={shouldShowMenu}
          aria-haspopup="true"
          aria-controls={shouldShowMenu ? ARIA_ID_TAG_OPTIONS : undefined}
          role="combobox"
        />
        <input
          type="hidden"
          name={name}
          value={isRevealingRawText
            ? convertStringToArray(
              inputText,
              shouldParameterize,
              !behavesAsDropdown,
            ).join(',')
            : value}
        />
        {accessory}
      </div>
      <div className="relative">
        {shouldShowMenu && optionsFiltered.length > 0 &&
          <div
            className={clsx(
              'component-surface z-1',
              'absolute top-3 w-full px-1.5 py-1.5 -mx-px',
              'max-h-[8rem] overflow-y-auto flex flex-col',
              'shadow-lg dark:shadow-xl',
            )}
          >
            <MaskedScroll
              id={ARIA_ID_TAG_OPTIONS}
              role="listbox"
              className="flex flex-col gap-y-1 text-xl"
              ref={optionsRef}
              fadeSize={16}
            >
              {/* Menu Options */}
              {optionsFiltered.map(({
                value,
                annotation,
                annotationAria,
              }, index) =>
                // Enter/Arrow keys are handled by the container-level
                // keydown listener above, which they bubble up to
                /* eslint-disable-next-line
                  jsx-a11y/click-events-have-key-events */
                <div
                  key={value}
                  role="option"
                  aria-selected={
                    index === selectedOptionIndex ||
                    (
                      !shouldRevealRawText &&
                      index === 0 &&
                      selectedOptionIndex === undefined
                    )
                  }
                  tabIndex={0}
                  className={clsx(
                    'group flex items-center gap-2',
                    'px-1.5 py-1 rounded-sm',
                    'text-base select-none',
                    hasReachedLimit ? 'cursor-not-allowed' : 'cursor-pointer',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    !hasReachedLimit &&
                      'active:bg-gray-50 dark:active:bg-gray-900',
                    'focus:bg-gray-100 dark:focus:bg-gray-800',
                    !shouldRevealRawText &&
                    index === 0 &&
                    selectedOptionIndex === undefined &&
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
                      className="truncate text-dim text-sm"
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
