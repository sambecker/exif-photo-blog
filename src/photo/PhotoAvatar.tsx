import ImageMedium from '@/components/image/ImageMedium';
import { altTextForPhoto, Photo } from '.';
import clsx from 'clsx/lite';

export default function PhotoAvatar({
  photo,
  className,
}: {
  photo?: Photo
  className?: string
}) {
  return (
    <span className={clsx(
      'inline-block',
      'size-12 rounded-full overflow-auto',
      'border border-medium bg-dim',
      className,
    )}>
      {photo && <ImageMedium
        src={photo.url}
        className="object-cover w-full h-full"
        alt={altTextForPhoto(photo)}
        blurDataURL={photo.blurData}
        aspectRatio={photo.aspectRatio}
      />}
    </span>
  );
}