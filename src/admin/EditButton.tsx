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
      title={label}
      href={href}
      className="button"
      prefetch={false}
    >
      <FaRegEdit className="translate-y-[-0.5px]" />
      <span className="hidden sm:inline-block">
        {label}
      </span>
    </Link>
  );
}
