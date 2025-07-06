import { ComponentProps } from 'react';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import IconHidden from '@/components/icons/IconHidden';

export default function FieldsetExclude(props: Omit<
  ComponentProps<typeof FieldSetWithStatus>,
  'label' | 'icon' | 'type'
>) {
  return (
    <FieldSetWithStatus
      {...props}
      label="Exclude from feeds"
      type="checkbox"
      icon={<IconHidden
        size={17}
        className="translate-y-[0.5px]"
        visible={props.value !== 'true'}
      />}
      tooltip="Do not show on homepage views or RSS"
    />
  );
}
