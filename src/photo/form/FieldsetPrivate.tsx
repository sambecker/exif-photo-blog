import { ComponentProps } from 'react';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import IconLock from '@/components/icons/IconLock';

export default function FieldsetPrivate(props: Omit<
  ComponentProps<typeof FieldSetWithStatus>,
  'label' | 'icon' | 'type'
>) {
  return (
    <FieldSetWithStatus
      {...props}
      label="Private"
      type="checkbox"
      icon={<IconLock
        size={15}
        open={props.value !== 'true'}
        narrow
      />}
      tooltip="Visible only to authenticated admin"
    />
  );
}
