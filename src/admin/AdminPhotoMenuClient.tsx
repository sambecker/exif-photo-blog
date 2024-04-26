'use client';

import { ComponentProps } from 'react';
import { pathForAdminPhotoEdit, pathForPhoto } from '@/site/paths';
import { deletePhotoAction, toggleFavoritePhotoAction } from '@/photo/actions';
import { FaRegEdit, FaRegStar, FaStar } from 'react-icons/fa';
import { Photo, deleteConfirmationTextForPhoto } from '@/photo';
import { isPathFavs, isPhotoFav } from '@/tag';
import { usePathname } from 'next/navigation';
import { BiTrash } from 'react-icons/bi';
import MoreMenu from '@/components/MoreMenu';
import { useAppState } from '@/state/AppState';
import { RevalidatePhotos } from '@/photo/InfinitePhotoScroll';

export default function AdminPhotoMenuClient({
  photo,
  revalidatePhoto,
  ...props
}: Omit<ComponentProps<typeof MoreMenu>, 'items'> & {
  photo: Photo
  revalidatePhoto?: RevalidatePhotos
}) {
  const { isUserSignedIn } = useAppState();

  const isFav = isPhotoFav(photo);
  const path = usePathname();
  const shouldRedirectFav = isPathFavs(path) && isFav;
  const shouldRedirectDelete = pathForPhoto(photo.id) === path;

  return (
    isUserSignedIn
      ? <MoreMenu {...{
        items: [
          {
            label: 'Edit',
            icon: <FaRegEdit size={14} />,
            href: pathForAdminPhotoEdit(photo.id),
          }, {
            label: isFav ? 'Unfavorite' : 'Favorite',
            icon: isFav
              ? <FaStar
                size={14}
                className="text-amber-500 translate-x-[-1.5px]"
              />
              : <FaRegStar
                size={14}
                className="translate-x-[-2px]"
              />,
            action: () => toggleFavoritePhotoAction(
              photo.id,
              shouldRedirectFav,
            ).then(() => revalidatePhoto?.()),
          }, {
            label: 'Delete',
            icon: <BiTrash
              size={14}
              className="translate-x-[-1.5px] "
            />,
            action: () => {
              if (confirm(deleteConfirmationTextForPhoto(photo))) {
                return deletePhotoAction(
                  photo.id,
                  photo.url,
                  shouldRedirectDelete,
                ).then(() => {
                  revalidatePhoto?.(true);
                });
              }
            },
          },
        ],
        ...props,
      }}/>
      : null
  );
}
