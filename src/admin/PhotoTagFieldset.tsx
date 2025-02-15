'use client';

import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import { convertTagsForForm, getValidationMessageForTags, Tags } from '@/tag';
import { ComponentProps, useEffect, useRef, useState } from 'react';

export default function PhotoTagFieldset(props: {
  tags: string
  tagOptions?: Tags
  onChange: (tags: string) => void
  onError?: (error: string) => void
  openOnLoad?: boolean
} & Partial<Omit<
  ComponentProps<typeof FieldSetWithStatus>,
  'tagOptions'
>>) {
  const {
    id,
    tags,
    tagOptions,
    onChange,
    onError,
    openOnLoad,
    ...rest
  } = props;

  const ref = useRef<HTMLInputElement>(null);

  const [errorMessageLocal, setErrorMessageLocal] = useState('');

  useEffect(() => {
    if (openOnLoad) {
      const timeout = setTimeout(() => {
        ref.current?.querySelectorAll('input')[0]?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [openOnLoad]);
  
  return (
    <div ref={ref}>
      <FieldSetWithStatus
        {...rest}
        inputRef={ref}
        id={id ?? 'tags'}
        value={tags}
        tagOptions={convertTagsForForm(tagOptions)}
        onChange={tags => {
          onChange(tags);
          const validationMessage = getValidationMessageForTags(tags) ?? '';
          onError?.(validationMessage);
          setErrorMessageLocal(validationMessage);
        }}
        error={errorMessageLocal}
      />
    </div>
  );
}
