import { IMAGE_LARGE_WIDTH } from '@/site';
import Image from 'next/image';
import Link from 'next/link';

export default function ImageLarge({
  className,
  href,
  src,
  alt,
  aspectRatio,
  blurData,
  priority,
}: {
  className?: string
  href: string
  src: string
  alt: string
  aspectRatio: number
  blurData: string
  priority?: boolean
}) {
  return (
    <Link
      href={href}
      className="active:brightness-75"
    >
      <Image {...{
        className,
        src,
        alt,
        priority,
        blurDataURL: blurData,
        placeholder: 'blur',
        width: IMAGE_LARGE_WIDTH,
        height: Math.round(IMAGE_LARGE_WIDTH / aspectRatio),
      }} />
    </Link>
  );
};
