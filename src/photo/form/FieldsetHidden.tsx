import { ComponentProps } from 'react';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import IconHidden from '@/components/icons/IconHidden';

export default function FieldsetHidden(props: Omit<
  ComponentProps<typeof FieldSetWithStatus>,
  'label' | 'icon' | 'type'
>) {
  return (
    <FieldSetWithStatus
      {...props}
      label="Hidden"
      type="checkbox"
      icon={<IconHidden size={17} visible={props.value !== 'true'} />}
    />
  );
}
