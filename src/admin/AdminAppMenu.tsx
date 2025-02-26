'use client';

import MoreMenu from '@/components/more/MoreMenu';
import {
  PATH_ADMIN_INSIGHTS,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_TAGS,
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

export default function AdminAppMenu({
  className,
  buttonClassName,
}: {
  className?: string
  buttonClassName?: string
}) {
  const {
    selectedPhotoIds,
    setSelectedPhotoIds,
  } = useAppState();

  const isSelecting = selectedPhotoIds !== undefined;

  return (
    <MoreMenu
      header="Admin menu"
      icon={<BiLockAlt size={16} className="translate-y-[-0.5px]" />}
      align="start"
      className={clsx(
        'border-medium',
        className,
      )}
      buttonClassName={clsx(
        'rounded-none focus:outline-none',
        buttonClassName,
      )}
      items={[{
        label: 'Manage Photos',
        icon: <TbPhoto
          size={16}
          className="translate-x-[1px] translate-y-[0.5px]"
        />,
        href: PATH_ADMIN_PHOTOS,
      }, {
        label: 'Manage Tags',
        icon: <FiTag
          size={16}
          className="translate-x-[1.5px] translate-y-[0.5px]"
        />,
        href: PATH_ADMIN_TAGS,
      }, {
        label: 'App Info',
        icon: <AdminAppInfoIcon
          size="small"
          className="translate-x-[1px] translate-y-[-0.5px]"
        />,
        href: PATH_ADMIN_INSIGHTS,
      }, {
        label: isSelecting
          ? 'Exit Select'
          : 'Select Photos',
        icon: isSelecting
          ? <IoCloseSharp
            className="text-[18px] translate-y-[-0.5px]"
          />
          : <ImCheckboxUnchecked
            className="text-[0.75rem] translate-x-[1px]"
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
      }]}
      ariaLabel="Admin Menu"
    />
  );
}
