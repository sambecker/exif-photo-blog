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
      className="flex items-center gap-x-1.5"
    >
      <FaTag size={11} />
      <span className="uppercase">{tag.replaceAll('-', ' ')}</span>
    </Link>
  );
}
