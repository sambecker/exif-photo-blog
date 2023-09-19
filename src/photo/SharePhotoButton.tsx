import { Photo } from '.';
import { pathForPhotoShare } from '@/site/paths';
import { TbPhotoShare } from 'react-icons/tb';
import IconPathButton from '@/components/IconPathButton';

export default function SharePhotoButton({
  photo,
  tag,
  prefetch,
}: {
  photo: Photo
  tag?: string
  prefetch?: boolean
}) {
  return (
    <IconPathButton
      icon={<TbPhotoShare size={17} />}
      path={pathForPhotoShare(photo, tag)}
      prefetch={prefetch}
    />
  );
}
