import { IMAGE_SMALL_WIDTH } from '@/site';
import Image from 'next/image';

export default function ImageSmall({
  className,
  src,
  alt,
  aspectRatio,
  blurData,
}: {
  className?: string
  src: string
  alt: string
  aspectRatio: number
  blurData: string
}) {
  return (
    <Image {...{
      className,
      src,
      alt,
      blurDataURL: blurData,
      placeholder: 'blur',
      width: IMAGE_SMALL_WIDTH,
      height: Math.round(IMAGE_SMALL_WIDTH / aspectRatio),
    }} />
  );
};
