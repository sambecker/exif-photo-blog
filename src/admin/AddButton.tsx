import { BiImageAdd } from 'react-icons/bi';
import PathLoaderButton from '@/components/primitives/PathLoaderButton';

export default function AddButton({
  path,
}: {
  path: string,
}) {
  return (
    <PathLoaderButton
      path={path}
      icon={<BiImageAdd size={18} className="translate-x-[1px]" />}
    >
      Add
    </PathLoaderButton>
  );
}
