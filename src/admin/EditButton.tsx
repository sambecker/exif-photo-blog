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
      icon={<IconEdit className="translate-y-[1px]" />}
    >
      {children || 'Edit'}
    </PathLoaderButton>
  );
}
