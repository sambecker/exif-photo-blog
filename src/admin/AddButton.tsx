import Link from 'next/link';
import { BiImageAdd } from 'react-icons/bi';

export default function AddButton ({
  href,
  label = 'Add',
}: {
  href: string,
  label?: string,
}) {
  return (
    <Link
      title={label}
      href={href}
      className="button"
    >
      <BiImageAdd size={18} className="translate-y-[1px]" />
      <span className="hidden sm:inline-block">
        {label}
      </span>
    </Link>
  );
}
