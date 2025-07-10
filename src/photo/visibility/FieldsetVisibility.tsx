import FieldSetWithStatus from '@/components/FieldsetWithStatus';
import { ComponentProps, Dispatch, SetStateAction } from 'react';
import {
  getVisibilityValue,
  updateFormDataWithVisibility,
  VISIBILITY_OPTIONS,
  VisibilityValue,
} from '.';
import { PhotoFormData } from '../form';

export default function FieldsetVisibility({
  formData,
  setFormData,
  ...props
}: {
  label?: string
  formData: Partial<PhotoFormData>
  setFormData: Dispatch<SetStateAction<Partial<PhotoFormData>>>
} & Omit<ComponentProps<typeof FieldSetWithStatus>, 'label' | 'value'>) {
  return (
    <FieldSetWithStatus
      label="Visibility"
      {...props}
      selectOptions={VISIBILITY_OPTIONS}
      value={getVisibilityValue(formData)}
      onChange={value => setFormData(data =>
        updateFormDataWithVisibility(
          data,
          value as VisibilityValue,
        ))}
    />
  );
}
