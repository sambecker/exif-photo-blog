'use client';

import { LegacyRef } from 'react';
import { useFormStatus } from 'react-dom';
import Spinner from './Spinner';
import { cc } from '@/utility/css';

export default function FieldSetWithStatus({
  id,
  label,
  note,
  value,
  onChange,
  selectOptions,
  selectOptionsDefaultLabel,
  placeholder,
  loading,
  required,
  readOnly,
  type = 'text',
  inputRef,
}: {
  id: string
  label: string
  note?: string
  value: string
  onChange?: (value: string) => void
  selectOptions?: { value: string, label: string }[]
  selectOptionsDefaultLabel?: string
  placeholder?: string
  loading?: boolean
  required?: boolean
  readOnly?: boolean
  type?: 'text' | 'email' | 'password' | 'checkbox'
  inputRef?: LegacyRef<HTMLInputElement>
}) {
  const { pending } = useFormStatus();

  return (
    <div className="space-y-1">
      <label
        className="flex gap-2 items-center select-none"
        htmlFor={id}
      >
        {label}
        {note &&
          <span className="text-gray-400 dark:text-gray-600">
            ({note})
          </span>}
        {required &&
          <span className="text-gray-400 dark:text-gray-600">
            Required
          </span>}
        {loading &&
          <span className="translate-y-[1.5px]">
            <Spinner />
          </span>}
      </label>
      {selectOptions
        ? <select
          id={id}
          name={id}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className={cc(
            'w-full',
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
          readOnly={readOnly || pending}
          className={cc(type === 'text' && 'w-full')}
        />}
    </div>
  );
};
