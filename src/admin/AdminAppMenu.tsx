'use client';

import MoreMenu from '@/components/more/MoreMenu';
import {
  PATH_ADMIN_INSIGHTS,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_UPLOADS,
  PATH_GRID_INFERRED,
} from '@/app/paths';
import { useAppState } from '@/state/AppState';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { IoCloseSharp } from 'react-icons/io5';
import { clsx } from 'clsx/lite';
import { TbPhoto } from 'react-icons/tb';
import { FiTag } from 'react-icons/fi';
import { BiLockAlt } from 'react-icons/bi';
import AdminAppInfoIcon from './AdminAppInfoIcon';
import { PiSignOutBold } from 'react-icons/pi';
import { signOutAction } from '@/auth/actions';
import { ComponentProps } from 'react';
import { FaRegFolderOpen } from 'react-icons/fa';

export default function AdminAppMenu({
  className,
  buttonClassName,
}: {
  className?: string
  buttonClassName?: string
}) {
  const {
    photosCount,
    uploadsCount,
    tagsCount,
    selectedPhotoIds,
    setSelectedPhotoIds,
    refreshAdminData,
    clearAuthStateAndRedirect,
  } = useAppState();

  const isSelecting = selectedPhotoIds !== undefined;

  const items: ComponentProps<typeof MoreMenu>['items'] = [{
    label: 'Manage Photos',
    ...photosCount !== undefined && {
      annotation: `${photosCount}`,
    },
    icon: <TbPhoto
      size={15}
      className="translate-x-[-0.5px] translate-y-[0.5px]"
    />,
    href: PATH_ADMIN_PHOTOS,
  }];

  if (uploadsCount) {
    items.push({
      label: 'Uploads',
      annotation: `${uploadsCount}`,
      icon: <FaRegFolderOpen
        size={16}
        className="translate-y-[0.5px]"
      />,
      href: PATH_ADMIN_UPLOADS,
    });
  }

  if (tagsCount) {
    items.push({
      label: 'Manage Tags',
      annotation: `${tagsCount}`,
      icon: <FiTag
        size={15}
        className="translate-y-[0.5px]"
      />,
      href: PATH_ADMIN_TAGS,
    });
  }

  items.push({
    label: 'App Info',
    icon: <AdminAppInfoIcon
      size="small"
      className="translate-x-[-0.5px] translate-y-[-0.5px]"
    />,
    href: PATH_ADMIN_INSIGHTS,
  }, {
    label: isSelecting
      ? 'Exit Select'
      : 'Edit Multiple …',
    icon: isSelecting
      ? <IoCloseSharp
        className="text-[18px] translate-x-[-1px] translate-y-[1px]"
      />
      : <ImCheckboxUnchecked
        className="translate-x-[-0.5px] text-[0.75rem]"
      />,
    href: PATH_GRID_INFERRED,
    action: () => {
      if (isSelecting) {
        setSelectedPhotoIds?.(undefined);
      } else {
        setSelectedPhotoIds?.([]);
      }
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    },
    shouldPreventDefault: false,
  }, {
    label: 'Sign Out',
    icon: <PiSignOutBold size={15} />,
    action: () => signOutAction().then(clearAuthStateAndRedirect),
  });

  return (
    <MoreMenu
      header="Admin menu"
      icon={<BiLockAlt size={16} className="translate-y-[-0.5px]" />}
      align="start"
      onOpen={refreshAdminData}
      className={clsx(
        'border-medium',
        className,
      )}
      buttonClassName={clsx(
        'rounded-none focus:outline-none',
        buttonClassName,
      )}
      items={items}
      ariaLabel="Admin Menu"
    />
  );
}
