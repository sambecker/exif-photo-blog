'use client';

import { InputHTMLAttributes, useRef, RefObject, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import Spinner from './Spinner';
import { clsx } from 'clsx/lite';
import { FieldSetType, AnnotatedTag } from '@/photo/form';
import TagInput from './TagInput';
import { FiChevronDown } from 'react-icons/fi';
import { parameterize } from '@/utility/string';
import Checkbox from './Checkbox';

export default function FieldSetWithStatus({
  id: _id,
  label,
  icon,
  note,
  error,
  value,
  isModified,
  onChange,
  className,
  selectOptions,
  selectOptionsDefaultLabel,
  tagOptions,
  tagOptionsLimit,
  tagOptionsLimitValidationMessage,
  placeholder,
  loading,
  required,
  readOnly,
  spellCheck,
  capitalize,
  type = 'text',
  inputRef: inputRefProp,
  accessory,
  hideLabel,
}: {
  id?: string
  label: string
  icon?: ReactNode
  note?: string
  error?: string
  value: string
  isModified?: boolean
  onChange?: (value: string) => void
  className?: string
  selectOptions?: { value: string, label: string }[]
  selectOptionsDefaultLabel?: string
  tagOptions?: AnnotatedTag[]
  tagOptionsLimit?: number
  tagOptionsLimitValidationMessage?: string
  placeholder?: string
  loading?: boolean
  required?: boolean
  readOnly?: boolean
  spellCheck?: boolean
  capitalize?: boolean
  type?: FieldSetType
  inputRef?: RefObject<HTMLInputElement | null>
  accessory?: React.ReactNode
  hideLabel?: boolean
}) {
  const inputRefInternal = useRef<HTMLInputElement>(null);

  const inputRef = inputRefProp ?? inputRefInternal;

  const id = _id || parameterize(label);

  const { pending } = useFormStatus();

  const inputProps: InputHTMLAttributes<HTMLInputElement> = {
    id,
    name: id,
    type,
    value,
    checked: type === 'checkbox'
      ? value === 'true' ? true : false
      : undefined,
    placeholder,
    onChange: e => onChange?.(type === 'checkbox'
      ? e.target.value === 'true' ? 'false' : 'true'
      : e.target.value),
    spellCheck,
    autoComplete: 'off',
    autoCapitalize: !capitalize ? 'off' : undefined,
    readOnly: readOnly || pending || loading,
    disabled: type === 'checkbox' && (
      readOnly || pending || loading
    ),
    className: clsx(
      (
        type === 'text' ||
        type === 'email' ||
        type === 'password'
      ) && 'w-full',
      type === 'checkbox' && (
        readOnly || pending || loading
      ) && 'opacity-50 cursor-not-allowed',
      Boolean(error) && 'error',
    ),
  };

  return (
    type === 'hidden'
      ? <input ref={inputRef} {...inputProps} />
      : <div className={clsx(
        // For managing checkbox active state
        'group',
        'space-y-1',
        type === 'checkbox' && 'flex items-center gap-3',
        className,
      )}>
        {!hideLabel &&
          <label
            htmlFor={id}
            className={clsx(
              'inline-flex flex-wrap gap-x-2 items-center select-none',
              type === 'checkbox' && 'order-2 m-0',
            )}
          >
            <span className="inline-flex items-center gap-x-1.5">
              {icon && <span
                className="inline-flex items-center justify-center w-4"
              >
                {icon}
              </span>}
              {label}
            </span>
            {note && !error &&
              <span className="text-gray-400 dark:text-gray-600">
                ({note})
              </span>}
            {isModified && !error &&
              <span className={clsx(
                'text-main font-medium text-[0.9rem]',
                ' -ml-1.5 translate-y-[-1px]',
              )}>
                *
              </span>}
            {error &&
              <span className="text-error">
                {error}
              </span>}
            {required &&
              <span className="text-gray-400 dark:text-gray-600">
                Required
              </span>}
            {loading && type !== 'checkbox' &&
              <span className="translate-y-[1.5px]">
                <Spinner />
              </span>}
          </label>}
        <div className="flex gap-2">
          {selectOptions
            ? <div className="relative w-full">
              <select
                id={id}
                name={id}
                value={value}
                onChange={e => onChange?.(e.target.value)}
                className={clsx(
                  'w-full',
                  clsx(Boolean(error) && 'error'),
                  // Use special class because `select` can't be readonly
                  readOnly || pending && 'disabled-select',
                )}
              >
                {selectOptionsDefaultLabel &&
                  <option value="">{selectOptionsDefaultLabel}</option>}
                {selectOptions.map(({
                  value: optionValue,
                  label: optionLabel,
                }) =>
                  <option
                    key={optionValue}
                    value={optionValue}
                  >
                    {optionLabel}
                  </option>)}
              </select>
              <div className={clsx(
                'absolute top-0 right-3 z-10 pointer-events-none',
                'flex h-full items-center',
                'text-extra-dim text-2xl',
              )}>
                <FiChevronDown />
              </div>
            </div>
            : tagOptions
              ? <TagInput
                id={id}
                name={id}
                value={value}
                options={tagOptions}
                onChange={onChange}
                showMenuOnDelete={tagOptionsLimit === 1}
                className={clsx(Boolean(error) && 'error')}
                readOnly={readOnly || pending || loading}
                placeholder={placeholder}
                limit={tagOptionsLimit}
                limitValidationMessage={tagOptionsLimitValidationMessage}
              />
              : type === 'textarea'
                ? <textarea
                  id={id}
                  name={id}
                  value={value}
                  placeholder={placeholder}
                  onChange={e => onChange?.(e.target.value)}
                  readOnly={readOnly || pending || loading}
                  spellCheck={spellCheck}
                  autoCapitalize={!capitalize ? 'off' : undefined}
                  className={clsx(
                    'w-full h-24 resize-none',
                    Boolean(error) && 'error',
                  )}
                />
                : type === 'checkbox'
                  ? <Checkbox
                    ref={inputRef}
                    accessory={loading && <Spinner
                      className="translate-y-[0.5px]"
                    />}
                    {...inputProps}
                  />
                  : <input
                    ref={inputRef}
                    {...inputProps}
                  />}
          {accessory && <div>
            {accessory}
          </div>}
        </div>
      </div>
  );
};
