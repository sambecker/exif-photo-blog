import IconEdit from '@/components/icons/IconEdit';
import PathLoaderButton from '@/components/primitives/PathLoaderButton';

export default function EditButton ({
  path,
}: {
  path: string,
}) {
  return (
    <PathLoaderButton
      path={path}
      icon={<IconEdit size={15} className="translate-y-[0.5px]" />}
    >
      Edit
    </PathLoaderButton>
  );
}
