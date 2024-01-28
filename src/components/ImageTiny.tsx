import { IMAGE_TINY_WIDTH } from '@/site';
import ImageBlurFallback from './ImageBlurFallback';

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
    <ImageBlurFallback {...{
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
