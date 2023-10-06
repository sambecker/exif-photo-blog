import Link from 'next/link';
import { FaRegEdit } from 'react-icons/fa';

export default function EditButton ({
  href,
  label = 'Edit',
}: {
  href: string,
  label?: string,
}) {
  return (
    <Link
      title="Edit"
      href={href}
      className="button"
    >
      <FaRegEdit className="translate-y-[-0.5px]" />
      <span className="hidden sm:inline-block">
        {label}
      </span>
    </Link>
  );
}
