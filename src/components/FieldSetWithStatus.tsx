'use client';

import { LegacyRef } from 'react';
import { useFormStatus } from 'react-dom';
import Spinner from './Spinner';
import { clsx } from 'clsx/lite';
import { FieldSetType, AnnotatedTag } from '@/photo/form';
import TagInput from './TagInput';

export default function FieldSetWithStatus({
  id,
  label,
  note,
  error,
  value,
  isModified,
  onChange,
  selectOptions,
  selectOptionsDefaultLabel,
  tagOptions,
  placeholder,
  loading,
  required,
  readOnly,
  capitalize,
  type = 'text',
  inputRef,
  accessory,
  hideLabel,
}: {
  id: string
  label?: string
  note?: string
  error?: string
  value: string
  isModified?: boolean
  onChange?: (value: string) => void
  selectOptions?: { value: string, label: string }[]
  selectOptionsDefaultLabel?: string
  tagOptions?: AnnotatedTag[]
  placeholder?: string
  loading?: boolean
  required?: boolean
  readOnly?: boolean
  capitalize?: boolean
  type?: FieldSetType
  inputRef?: LegacyRef<HTMLInputElement>
  accessory?: React.ReactNode
  hideLabel?: boolean
}) {
  const { pending } = useFormStatus();

  return (
    <div className={clsx(
      'space-y-1',
      type === 'checkbox' && 'flex items-center gap-2',
    )}>
      {!hideLabel && label &&
        <label
          className={clsx(
            'flex gap-2 items-center select-none',
            type === 'checkbox' && 'order-2 pt-[3px]',
          )}
          htmlFor={id}
        >
          {label}
          {note && !error &&
            <span className="text-gray-400 dark:text-gray-600">
              ({note})
            </span>}
          {isModified && !error &&
            <span className={clsx(
              'text-main font-medium text-[0.9rem] -ml-1.5 translate-y-[-1px]'
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
          {loading &&
            <span className="translate-y-[1.5px]">
              <Spinner />
            </span>}
        </label>}
      <div className="flex gap-2">
        {selectOptions
          ? <select
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
            {selectOptions.map(({ value: optionValue, label: optionLabel }) =>
              <option
                key={optionValue}
                value={optionValue}
              >
                {optionLabel}
              </option>)}
          </select>
          : tagOptions
            ? <TagInput
              id={id}
              name={id}
              value={value}
              options={tagOptions}
              onChange={onChange}
              className={clsx(Boolean(error) && 'error')}
              readOnly={readOnly || pending || loading}
              placeholder={placeholder}
            />
            : type === 'textarea'
              ? <textarea
                id={id}
                name={id}
                value={value}
                placeholder={placeholder}
                onChange={e => onChange?.(e.target.value)}
                readOnly={readOnly || pending || loading}
                className={clsx(
                  'w-full h-24 resize-none',
                  Boolean(error) && 'error',
                )}
              />
              : type === 'file'
                ? <input
                  ref={inputRef}
                  id={id}
                  name={id}
                  type="file"
                  onChange={e => onChange?.(e.target.files?.[0]?.name || '')}
                  readOnly={readOnly || pending || loading}
                  className={clsx(
                    'w-full',
                    Boolean(error) && 'error',
                  )}
                />
                : <input
                  ref={inputRef}
                  id={id}
                  name={id}
                  value={value}
                  checked={type === 'checkbox' ? value === 'true' : undefined}
                  placeholder={placeholder}
                  onChange={e => onChange?.(type === 'checkbox'
                    ? e.target.value === 'true' ? 'false' : 'true'
                    : e.target.value)}
                  type={type}
                  autoComplete="off"
                  autoCapitalize={!capitalize ? 'off' : undefined}
                  readOnly={readOnly || pending || loading}
                  disabled={type === 'checkbox' && (
                    readOnly || pending || loading
                  )}
                  className={clsx(
                    (
                      type === 'text' ||
                      type === 'email' ||
                      type === 'password'
                    ) && 'w-full',
                    type === 'checkbox' && (
                      readOnly || pending || loading
                    ) && 'opacity-50 cursor-not-allowed',
                    Boolean(error) && 'error',
                  )}
                />}
        {accessory && <div>
          {accessory}
        </div>}
      </div>
    </div>
  );
};