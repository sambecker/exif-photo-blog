'use client';

import {
  PATH_ADMIN_CONFIGURATION,
  PATH_ADMIN_INSIGHTS,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_PHOTOS_UPDATES,
  PATH_ADMIN_RECIPES,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_UPLOADS,
  PATH_GRID_INFERRED,
} from '@/app/path';
import { useAppState } from '@/app/AppState';
import { IoArrowDown, IoArrowUp } from 'react-icons/io5';
import { clsx } from 'clsx/lite';
import AdminAppInfoIcon from './AdminAppInfoIcon';
import { signOutAction } from '@/auth/actions';
import { ComponentProps, useEffect, useMemo } from 'react';
import useIsKeyBeingPressed from '@/utility/useIsKeyBeingPressed';
import IconPhoto from '@/components/icons/IconPhoto';
import IconUpload from '@/components/icons/IconUpload';
import IconRecipe from '@/components/icons/IconRecipe';
import IconTag from '@/components/icons/IconTag';
import IconFolder from '@/components/icons/IconFolder';
import IconSignOut from '@/components/icons/IconSignOut';
import { IoMdCheckboxOutline } from 'react-icons/io';
import IconBroom from '@/components/icons/IconBroom';
import InsightsIndicatorDot from './insights/InsightsIndicatorDot';
import MoreMenuItem from '@/components/more/MoreMenuItem';
import Spinner from '@/components/Spinner';
import { useAppText } from '@/i18n/state/client';
import SwitcherItemMenu from '@/components/switcher/SwitcherItemMenu';
import { MoreMenuSection } from '@/components/more/MoreMenu';
import { usePathname } from 'next/navigation';
import { FiXSquare } from 'react-icons/fi';

export default function AdminAppMenu({
  isOpen,
  setIsOpen,
}: {
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
}) {
  const pathname = usePathname();

  const {
    photosCountTotal = 0,
    photosCountNeedSync = 0,
    uploadsCount = 0,
    tagsCount = 0,
    recipesCount = 0,
    selectedPhotoIds,
    isLoadingAdminData,
    startUpload,
    setSelectedPhotoIds,
    refreshAdminData,
    clearAuthStateAndRedirectIfNecessary,
  } = useAppState();

  useEffect(() => {
    if (pathname !== PATH_GRID_INFERRED) {
      setSelectedPhotoIds?.(undefined);
    }
  }, [pathname, setSelectedPhotoIds]);

  const appText = useAppText();

  const isSelecting = selectedPhotoIds !== undefined;

  const isAltPressed = useIsKeyBeingPressed('alt');

  const showAppInsightsLink = photosCountTotal > 0 && !isAltPressed;

  const sectionUpload: MoreMenuSection = useMemo(() => ({ items: [{
    label: appText.admin.uploadPhotos,
    icon: <IconUpload
      size={15}
      className="translate-x-[0.5px] translate-y-[0.5px]"
    />,
    annotation: isLoadingAdminData &&
      <Spinner className="translate-y-[1.5px]" />,
    action: startUpload,
  }]}), [appText, isLoadingAdminData, startUpload]);

  const sectionMain: MoreMenuSection = useMemo(() => {
    const items: ComponentProps<typeof MoreMenuItem>[] = [];

    if (uploadsCount) {
      items.push({
        label: appText.admin.uploadPlural,
        annotation: `${uploadsCount}`,
        icon: <IconFolder
          size={16}
          className="translate-x-[1px] translate-y-[0.5px]"
        />,
        href: PATH_ADMIN_UPLOADS,
      });
    }
    if (photosCountNeedSync) {
      items.push({
        label: appText.admin.updatePlural,
        annotation: <>
          <span className="mr-3 text-blue-500">
            {photosCountNeedSync}
          </span>
          <InsightsIndicatorDot
            className="inline-block translate-y-[-1px]"
            colorOverride="blue"
            size="small"
          />
        </>,
        icon: <IconBroom
          size={18}
          className="translate-y-[-0.5px]"
        />,
        href: PATH_ADMIN_PHOTOS_UPDATES,
      });
    }
    if (photosCountTotal) {
      items.push({
        label: appText.admin.managePhotos,
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
    if (tagsCount) {
      items.push({
        label: appText.admin.manageTags,
        annotation: `${tagsCount}`,
        icon: <IconTag
          size={15}
          className="translate-y-[1.5px]"
        />,
        href: PATH_ADMIN_TAGS,
      });
    }
    if (recipesCount) {
      items.push({
        label: appText.admin.manageRecipes,
        annotation: `${recipesCount}`,
        icon: <IconRecipe
          size={17}
          className="translate-x-[-0.5px]"
        />,
        href: PATH_ADMIN_RECIPES,
      });
    }
    if (photosCountTotal) {
      items.push({
        label: isSelecting
          ? appText.admin.batchExitEdit
          : appText.admin.batchEditShort,
        icon: isSelecting
          ? <FiXSquare
            size={15}
            className="translate-x-[-0.75px] translate-y-[0.5px]"
          />
          : <IoMdCheckboxOutline
            size={16}
            className="translate-x-[-0.5px] translate-y-[0.5px]"
          />,
        ...pathname !== PATH_GRID_INFERRED && {
          href: PATH_GRID_INFERRED,
        },
        action: () => {
          if (isSelecting) {
            setSelectedPhotoIds?.(undefined);
          } else {
            setSelectedPhotoIds?.([]);
          }
        },
      });
    }
    items.push({
      label: showAppInsightsLink
        ? appText.admin.appInsights
        : appText.admin.appConfig,
      icon: <AdminAppInfoIcon
        size="small"
        className="translate-x-[-0.5px]"
      />,
      href: showAppInsightsLink
        ? PATH_ADMIN_INSIGHTS
        : PATH_ADMIN_CONFIGURATION,
    });

    return { items };
  }, [
    pathname,
    appText,
    isSelecting,
    photosCountNeedSync,
    photosCountTotal,
    recipesCount,
    setSelectedPhotoIds,
    showAppInsightsLink,
    tagsCount,
    uploadsCount,
  ]);

  const sectionSignOut: MoreMenuSection = useMemo(() => ({
    items: [{
      label: appText.auth.signOut,
      icon: <IconSignOut size={15} />,
      action: () => signOutAction().then(clearAuthStateAndRedirectIfNecessary),
    }],
  }), [appText.auth.signOut, clearAuthStateAndRedirectIfNecessary]);

  const sections = useMemo(() =>
    [sectionUpload, sectionMain, sectionSignOut]
  , [sectionUpload, sectionMain, sectionSignOut]);

  return (
    <SwitcherItemMenu
      {...{ isOpen, setIsOpen }}
      icon={<div className="w-[28px] h-[28px] overflow-hidden">
        <div className={clsx(
          'relative flex flex-col items-center justify-center gap-2',
          'translate-y-[-18px]',
        )}>
          <IoArrowDown size={16} className="shrink-0" />
          <IoArrowUp size={16} className="shrink-0" />
        </div>
      </div>}
      align="start"
      sideOffset={12}
      alignOffset={-84}
      onOpen={refreshAdminData}
      sections={sections}
      ariaLabel="Admin Menu"
      classNameButtonOpen={clsx(
        '[&>*>*]:translate-y-[6px]',
        '[&>*>*]:duration-300',
      )}
    />
  );
}
