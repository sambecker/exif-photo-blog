import { Photo } from '.';
import { pathForPhoto } from '@/site/paths';
import { TbPhotoShare } from 'react-icons/tb';
import IconPathButton from '@/components/IconPathButton';

export default function SharePhotoButton({
  photo,
  prefetch,
}: {
  photo: Photo
  prefetch?: boolean
}) {
  return (
    <IconPathButton
      path={pathForPhoto(photo, true)}
      prefetch={prefetch}
    >
      <TbPhotoShare size={17} />
    </IconPathButton>
  );
}
