import Link from 'next/link';
import { pathForTag } from '@/site/paths';
import { FaTag } from 'react-icons/fa';
import { cc } from '@/utility/css';
import { formatTag } from '.';

export default function PhotoTag({
  tag,
  showIcon = true,
}: {
  tag: string
  showIcon?: boolean
}) {
  return (
    <Link
      href={pathForTag(tag)}
      className={cc(
        'flex items-center gap-x-1.5 self-start',
        'hover:text-gray-900 dark:hover:text-gray-100',
      )}
    >
      {showIcon &&
        <FaTag
          size={11}
          className={cc(
            'flex-shrink-0',
            'text-gray-700 dark:text-gray-300 translate-y-[0.5px]',
          )}
        />}
      <span className="uppercase">
        {formatTag(tag)}
      </span>
    </Link>
  );
}
