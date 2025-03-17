'use client';

import MoreMenu from '@/components/more/MoreMenu';
import {
  PATH_ADMIN_CONFIGURATION,
  PATH_ADMIN_INSIGHTS,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_RECIPES,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_UPLOADS,
  PATH_GRID_INFERRED,
} from '@/app/paths';
import { useAppState } from '@/state/AppState';
import { IoArrowDown, IoArrowUp } from 'react-icons/io5';
import { clsx } from 'clsx/lite';
import AdminAppInfoIcon from './AdminAppInfoIcon';
import { signOutAction } from '@/auth/actions';
import { ComponentProps } from 'react';
import useIsKeyBeingPressed from '@/utility/useIsKeyBeingPressed';
import IconSelectMultiple from '@/components/icons/IconSelectMultiple';
import IconPhoto from '@/components/icons/IconPhoto';
import IconUpload from '@/components/icons/IconUpload';
import IconRecipe from '@/components/icons/IconRecipe';
import IconTag from '@/components/icons/IconTag';
import IconFolder from '@/components/icons/IconFolder';
import IconSignOut from '@/components/icons/IconSignOut';
import IconLock from '@/components/icons/IconLock';

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
    recipesCount = 0,
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
    icon: <IconUpload
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
  }];

  if (photosCountTotal) {
    items.push({
      label: 'Manage Photos',
      ...photosCountTotal && {
        annotation: `${photosCountTotal}`,
      },
      icon: <IconPhoto
        size={15}
        className="translate-x-[-0.5px] translate-y-[0.5px]"
      />,
      href: PATH_ADMIN_PHOTOS,
    });
  }

  if (uploadsCount) {
    items.push({
      label: 'Uploads',
      annotation: `${uploadsCount}`,
      icon: <IconFolder
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
      icon: <IconTag
        size={15}
        className="translate-y-[0.5px]"
      />,
      href: PATH_ADMIN_TAGS,
    });
  }

  if (recipesCount) {
    items.push({
      label: 'Manage Recipes',
      annotation: `${recipesCount}`,
      icon: <IconRecipe
        size={17}
        className="translate-x-[-0.5px] translate-y-[0.5px]"
      />,
      href: PATH_ADMIN_RECIPES,
    });
  }

  if (photosCountTotal) {
    items.push({
      label: isSelecting
        ? 'Exit Select'
        : 'Edit Multiple',
      icon: <IconSelectMultiple {...{ isSelecting }} />,
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
    label: 'Sign Out',
    icon: <IconSignOut size={15} />,
    action: () => signOutAction().then(clearAuthStateAndRedirect),
  });

  return (
    <MoreMenu
      header={<div className="flex items-center select-none">
        <IconLock
          size={15}
          className="inline-block w-5 mr-2"
          narrow
        />
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
