import IconEdit from '@/components/icons/IconEdit';
import PathLoaderButton from '@/components/primitives/PathLoaderButton';
import { ComponentProps } from 'react';

export default function EditButton ({
  children,
  ...props
}: ComponentProps<typeof PathLoaderButton>) {
  return (
    <PathLoaderButton
      {...props}
      icon={<IconEdit size={15} className="translate-y-[0.5px]" />}
    >
      {children || 'Edit'}
    </PathLoaderButton>
  );
}
