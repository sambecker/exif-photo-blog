import PathLoaderButton from '@/components/primitives/PathLoaderButton';
import { FaRegEdit } from 'react-icons/fa';

export default function EditButton ({
  path,
}: {
  path: string,
}) {
  return (
    <PathLoaderButton
      path={path}
      icon={<FaRegEdit size={15} className="translate-y-[0.5px]" />}
    >
      Edit
    </PathLoaderButton>
  );
}
