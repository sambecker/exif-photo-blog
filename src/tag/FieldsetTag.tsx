'use client';

import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { useAppText } from '@/i18n/state/client';
import { convertTagsForForm, getValidationMessageForTags, Tags } from '@/tag';
import { ComponentProps, useEffect, useRef, useState } from 'react';

export default function FieldsetTag(props: {
  tags: string
  tagOptions?: Tags
  onChange: (tags: string) => void
  onError?: (error: string) => void
  openOnLoad?: boolean
} & Partial<Omit<
  ComponentProps<typeof FieldsetWithStatus>,
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

  const ref = useRef<HTMLDivElement>(null);

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
      <FieldsetWithStatus
        {...rest}
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
