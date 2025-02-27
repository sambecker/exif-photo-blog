'use client';

import { ComponentProps, useMemo } from 'react';
import { pathForAdminPhotoEdit, pathForPhoto } from '@/app/paths';
import {
  deletePhotoAction,
  syncPhotoAction,
  toggleFavoritePhotoAction,
} from '@/photo/actions';
import { FaRegEdit, FaRegStar, FaStar } from 'react-icons/fa';
import {
  Photo,
  deleteConfirmationTextForPhoto,
  downloadFileNameForPhoto,
} from '@/photo';
import { isPathFavs, isPhotoFav } from '@/tag';
import { usePathname } from 'next/navigation';
import { BiTrash } from 'react-icons/bi';
import MoreMenu from '@/components/more/MoreMenu';
import { useAppState } from '@/state/AppState';
import { RevalidatePhoto } from '@/photo/InfinitePhotoScroll';
import { MdOutlineFileDownload } from 'react-icons/md';
import MoreMenuItem from '@/components/more/MoreMenuItem';
import IconGrSync from '@/app/IconGrSync';
import { isPhotoOutdated } from '@/photo/outdated';
import InsightsIndicatorDot from './insights/InsightsIndicatorDot';

export default function AdminPhotoMenuClient({
  photo,
  revalidatePhoto,
  includeFavorite = true,
  ...props
}: Omit<ComponentProps<typeof MoreMenu>, 'items'> & {
  photo: Photo
  revalidatePhoto?: RevalidatePhoto
  includeFavorite?: boolean
}) {
  const { isUserSignedIn, registerAdminUpdate } = useAppState();

  const isFav = isPhotoFav(photo);
  const path = usePathname();
  const shouldRedirectFav = isPathFavs(path) && isFav;
  const shouldRedirectDelete = pathForPhoto({ photo: photo.id }) === path;

  const favIconClass = 'translate-x-[-1px] translate-y-[0.5px]';

  const items = useMemo(() => {
    const items: ComponentProps<typeof MoreMenuItem>[] = [{
      label: 'Edit',
      icon: <FaRegEdit
        size={15}
        className="translate-x-[0.5px] translate-y-[-0.5px]"
      />,
      href: pathForAdminPhotoEdit(photo.id),
    }];
    if (includeFavorite) {
      items.push({
        label: isFav ? 'Unfavorite' : 'Favorite',
        icon: isFav
          ? <FaStar
            size={14}
            className={`text-amber-500 ${favIconClass}`}
          />
          : <FaRegStar
            size={14}
            className={favIconClass}
          />,
        action: () => toggleFavoritePhotoAction(
          photo.id,
          shouldRedirectFav,
        ).then(() => revalidatePhoto?.(photo.id)),
      });
    }
    items.push({
      label: 'Download',
      icon: <MdOutlineFileDownload
        size={17}
        className="translate-x-[-1px] translate-y-[-0.5px]"
      />,
      href: photo.url,
      hrefDownloadName: downloadFileNameForPhoto(photo),
    });
    items.push({
      label: 'Sync',
      labelComplex: <span className="inline-flex items-center gap-2">
        <span>Sync</span>
        {isPhotoOutdated(photo) &&
          <InsightsIndicatorDot
            colorOverride="yellow"
            className="translate-y-[1.5px]"
          />}
      </span>,
      icon: <IconGrSync className="translate-x-[-1px]" />,
      action: () => syncPhotoAction(photo.id)
        .then(() => revalidatePhoto?.(photo.id)),
    });
    items.push({
      label: 'Delete',
      icon: <BiTrash
        size={15}
        className="translate-x-[-1px]"
      />,
      className: 'text-error *:hover:text-error',
      action: () => {
        if (confirm(deleteConfirmationTextForPhoto(photo))) {
          return deletePhotoAction(
            photo.id,
            photo.url,
            shouldRedirectDelete,
          ).then(() => {
            revalidatePhoto?.(photo.id, true);
            registerAdminUpdate?.();
          });
        }
      },
    });
    return items;
  }, [
    photo,
    includeFavorite,
    isFav,
    shouldRedirectFav,
    revalidatePhoto,
    shouldRedirectDelete,
    registerAdminUpdate,
  ]);

  return (
    isUserSignedIn
      ? <MoreMenu {...{
        items,
        ...props,
      }}/>
      : null
  );
}
