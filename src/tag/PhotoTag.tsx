import Link from 'next/link';
import { pathForTag } from '@/site/paths';
import { FaTag } from 'react-icons/fa';
import { cc } from '@/utility/css';

export default function PhotoTag({
  tag,
}: {
  tag: string
}) {
  return (
    <Link
      key={tag}
      href={pathForTag(tag)}
      className="flex items-center gap-x-1.5 self-start"
    >
      <FaTag
        size={11}
        className={cc(
          'flex-shrink-0',
          'text-gray-700 dark:text-gray-300 translate-y-[0.5px]',
        )}
      />
      <span className="uppercase">
        {tag.replaceAll('-', ' ')}
      </span>
    </Link>
  );
}
