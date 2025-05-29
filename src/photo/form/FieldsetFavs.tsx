import { ComponentProps } from 'react';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import IconFavs from '@/components/icons/IconFavs';

export default function FieldsetFavs(props: Omit<
  ComponentProps<typeof FieldSetWithStatus>,
  'label' | 'icon' | 'type'
>) {
  return (
    <FieldSetWithStatus
      {...props}
      label="Favorite"
      type="checkbox"
      icon={<IconFavs size={14} highlight={props.value === 'true'} />}
    />
  );
}
