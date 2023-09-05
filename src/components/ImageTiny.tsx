import { IMAGE_TINY_WIDTH } from '@/site';
import Image from 'next/image';

export default function ImageTiny({
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
  blurData?: string
}) {
  return (
    <Image {...{
      className,
      src,
      alt,
      ...blurData && {
        blurDataURL: blurData,
        placeholder: 'blur',
      },
      width: IMAGE_TINY_WIDTH,
      height: Math.round(IMAGE_TINY_WIDTH / aspectRatio),
    }} />
  );
};
