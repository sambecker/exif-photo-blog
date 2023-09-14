import Link from 'next/link';
import { pathForTag } from '@/site/paths';
import { FaTag } from 'react-icons/fa';

export default function PhotoTag({
  tag,
}: {
  tag: string
}) {
  return (
    <Link
      key={tag}
      href={pathForTag(tag)}
      className="flex items-center gap-x-2"
    >
      <span className="uppercase">
        {tag.replaceAll('-', ' ')}
      </span>
      <FaTag size={11} />
    </Link>
  );
}
