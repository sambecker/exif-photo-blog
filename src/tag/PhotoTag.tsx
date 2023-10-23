import Link from 'next/link';
import { pathForTag } from '@/site/paths';
import { FaTag } from 'react-icons/fa';
import { cc } from '@/utility/css';
import { formatTag } from '.';

export default function PhotoTag({
  tag,
  showIcon = true,
  countOnHover,
}: {
  tag: string
  showIcon?: boolean
  countOnHover?: number
}) {
  return (
    <span className="group">
      <Link
        href={pathForTag(tag)}
        className={cc(
          'inline-flex items-center gap-x-1.5 self-start',
          'hover:text-gray-900 dark:hover:text-gray-100',
        )}
      >
        {showIcon &&
          <FaTag
            size={11}
            className={cc(
              'flex-shrink-0',
              'text-icon translate-y-[0.5px]',
            )}
          />}
        <span className="uppercase">
          {formatTag(tag)}
        </span>
      </Link>
      {countOnHover !== undefined &&
        <span className="hidden group-hover:inline">
          {' '}
          {countOnHover}
        </span>}
    </span>
  );
}
