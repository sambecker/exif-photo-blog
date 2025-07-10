import { ComponentProps } from 'react';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import IconFavs from '@/components/icons/IconFavs';

export default function FieldsetFavs(props: Omit<
  ComponentProps<typeof FieldsetWithStatus>,
  'label' | 'icon' | 'type'
>) {
  return (
    <FieldsetWithStatus
      {...props}
      label="Favorite"
      type="checkbox"
      icon={<IconFavs size={14} highlight={props.value === 'true'} />}
    />
  );
}
