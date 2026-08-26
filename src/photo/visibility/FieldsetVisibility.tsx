'use client';

import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { ComponentProps, Dispatch, SetStateAction } from 'react';
import {
  getVisibilityOptions,
  getVisibilityValue,
  updateFormDataWithVisibility,
  VisibilityValue,
} from '.';
import { PhotoFormData } from '../form';
import { useAppText } from '@/i18n/state/client';

export default function FieldsetVisibility({
  formData,
  setFormData,
  ...props
}: {
  label?: string
  formData: Partial<PhotoFormData>
  setFormData: Dispatch<SetStateAction<Partial<PhotoFormData>>>
} & Omit<ComponentProps<typeof FieldsetWithStatus>, 'label' | 'value'>) {
  const appText = useAppText();

  return (
    <FieldsetWithStatus
      id="visibility"
      label={appText.admin.setVisibility}
      {...props}
      selectOptions={getVisibilityOptions(appText)}
      value={getVisibilityValue(formData)}
      onChange={value => setFormData(data =>
        updateFormDataWithVisibility(
          data,
          value as VisibilityValue,
        ))}
    />
  );
}
