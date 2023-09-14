'use client';

import { LegacyRef } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export default function FieldSetWithStatus({
  id,
  label,
  note,
  value,
  onChange,
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
  required?: boolean
  readOnly?: boolean
  type?: 'text' | 'password'
  inputRef?: LegacyRef<HTMLInputElement>
}) {
  const { pending } = useFormStatus();

  return (
    <div className="space-y-1">
      <label
        className="flex gap-2"
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
      </label>
      <input
        ref={inputRef}
        id={id}
        name={id}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        type={type}
        autoComplete="off"
        readOnly={readOnly || pending}
        className="w-full"
      />
    </div>
  );
};
