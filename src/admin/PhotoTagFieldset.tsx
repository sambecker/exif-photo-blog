'use client';

import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import { useAppText } from '@/i18n/state/client';
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
    tags,
    tagOptions,
    onChange,
    onError,
    openOnLoad,
    ...rest
  } = props;

  const ref = useRef<HTMLInputElement>(null);

  const appText = useAppText();

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
        label="Tags"
        value={tags}
        tagOptions={convertTagsForForm(tagOptions, appText)}
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
