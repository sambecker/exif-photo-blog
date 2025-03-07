'use client';

import MoreMenu from '@/components/more/MoreMenu';
import {
  PATH_ADMIN_CONFIGURATION,
  PATH_ADMIN_INSIGHTS,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_UPLOADS,
  PATH_GRID_INFERRED,
} from '@/app/paths';
import { useAppState } from '@/state/AppState';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { IoArrowDown, IoArrowUp, IoCloseSharp } from 'react-icons/io5';
import { clsx } from 'clsx/lite';
import { TbPhoto } from 'react-icons/tb';
import { FiTag } from 'react-icons/fi';
import { BiLockAlt } from 'react-icons/bi';
import AdminAppInfoIcon from './AdminAppInfoIcon';
import { PiSignOutBold } from 'react-icons/pi';
import { signOutAction } from '@/auth/actions';
import { ComponentProps } from 'react';
import { FaRegFolderOpen } from 'react-icons/fa';
import { FiUploadCloud } from 'react-icons/fi';
import useIsKeyBeingPressed from '@/utility/useIsKeyBeingPressed';

export default function AdminAppMenu({
  active,
  animateMenuClose,
  className,
}: {
  active?: boolean
  animateMenuClose?: boolean
  className?: string
}) {
  const {
    photosCountTotal = 0,
    uploadsCount = 0,
    tagsCount = 0,
    selectedPhotoIds,
    startUpload,
    setSelectedPhotoIds,
    refreshAdminData,
    clearAuthStateAndRedirect,
  } = useAppState();

  const isSelecting = selectedPhotoIds !== undefined;

  const isAltPressed = useIsKeyBeingPressed('alt');

  const showAppInsightsLink = photosCountTotal > 0 && !isAltPressed;

  const items: ComponentProps<typeof MoreMenu>['items'] = [{
    label: 'Upload Photos',
    icon: <FiUploadCloud
      size={15}
      className="translate-x-[0.5px] translate-y-[0.5px]"
    />,
    action: () => new Promise(resolve => {
      if (startUpload) {
        startUpload(() => resolve());
      } else {
        resolve();
      }
    }),
  }, {
    label: 'Manage Photos',
    ...photosCountTotal && {
      annotation: `${photosCountTotal}`,
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
    label: showAppInsightsLink
      ? 'App Insights'
      : 'App Configuration',
    icon: <AdminAppInfoIcon
      size="small"
      className="translate-x-[-0.5px] translate-y-[-0.5px]"
    />,
    href: showAppInsightsLink
      ? PATH_ADMIN_INSIGHTS
      : PATH_ADMIN_CONFIGURATION,
  }, {
    label: isSelecting
      ? 'Exit Select'
      : 'Edit Multiple',
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
      header={<div className="flex items-center select-none">
        <BiLockAlt size={17} className="inline-block w-5 mr-2" />
        <span className="grow">Admin menu</span>
      </div>}
      icon={<div className={clsx(
        'w-[28px] h-[28px]',
        'overflow-hidden',
      )}>
        <div className={clsx(
          'flex flex-col items-center justify-center gap-2',
          'relative transition-transform',
          animateMenuClose ? 'duration-300' : 'duration-0',
          'translate-y-[-18px]',
        )}>
          <IoArrowDown size={16} className="shrink-0" />
          <IoArrowUp size={16} className="shrink-0" />
        </div>
      </div>}
      align="start"
      sideOffset={12}
      alignOffset={-85}
      onOpen={refreshAdminData}
      className={clsx(
        'border-medium',
        className,
      )}
      buttonClassName={clsx(
        'p-0!',
        'w-full h-full',
        'flex items-center justify-center',
        'hover:bg-transparent dark:hover:bg-transparent',
        'active:bg-transparent dark:active:bg-transparent',
        'rounded-none focus:outline-none',
        active
          ? 'text-black dark:text-white'
          : 'text-gray-400 dark:text-gray-600',
      )}
      buttonClassNameOpen={clsx(
        'bg-dim text-main!',
        '[&>*>*]:translate-y-[6px]',
        !animateMenuClose && '[&>*>*]:duration-300',
      )}
      items={items}
      ariaLabel="Admin Menu"
    />
  );
}
