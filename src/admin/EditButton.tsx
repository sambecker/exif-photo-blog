import PathLoaderButton from '@/components/PathLoaderButton';
import { FaRegEdit } from 'react-icons/fa';

export default function EditButton ({
  href,
}: {
  href: string,
}) {
  return (
    <PathLoaderButton
      path={href}
      icon={<FaRegEdit size={15} className="translate-y-[0.5px]" />}
    >
      Edit
    </PathLoaderButton>
  );
}
