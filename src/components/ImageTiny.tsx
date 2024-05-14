import { IMAGE_TINY_WIDTH } from '@/site';
import ImageWithFallback from './ImageWithFallback';

export default function ImageTiny({
  className,
  imgClassName,
  src,
  alt,
  aspectRatio,
  blurData,
  blurCompatibilityMode,
}: {
  className?: string
  imgClassName?: string
  src: string
  alt: string
  aspectRatio: number
  blurData?: string
  blurCompatibilityMode?: boolean
}) {
  return (
    <ImageWithFallback {...{
      className,
      imgClassName,
      src,
      alt,
      blurDataURL: blurData,
      blurCompatibilityLevel: blurCompatibilityMode ? 'high' : 'none',
      width: IMAGE_TINY_WIDTH,
      height: Math.round(IMAGE_TINY_WIDTH / aspectRatio),
    }} />
  );
};
