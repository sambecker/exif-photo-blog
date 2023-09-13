import { Photo } from '.';
import { routeForPhoto } from '@/site/routes';
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
      path={routeForPhoto(photo, true)}
      prefetch={prefetch}
    >
      <TbPhotoShare size={17} />
    </IconPathButton>
  );
}
