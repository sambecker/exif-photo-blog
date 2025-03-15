import { BiImageAdd } from 'react-icons/bi';
import PathLoaderButton from '@/components/primitives/PathLoaderButton';
import { ComponentProps } from 'react';
export default function AddButton(
  props: ComponentProps<typeof PathLoaderButton>,
) {
  return (
    <PathLoaderButton
      {...props}
      icon={<BiImageAdd
        size={18}
        className="translate-x-[1px] translate-y-[1px]"
      />}
    >
      Add
    </PathLoaderButton>
  );
}
