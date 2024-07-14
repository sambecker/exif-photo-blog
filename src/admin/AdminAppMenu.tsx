'use client';

import MoreMenu from '@/components/more/MoreMenu';
import { GRID_HOMEPAGE_ENABLED } from '@/site/config';
import { PATH_ADMIN_CONFIGURATION, PATH_GRID, PATH_ROOT } from '@/site/paths';
import { useAppState } from '@/state/AppState';
import { BiCog } from 'react-icons/bi';
import { FaTimes } from 'react-icons/fa';
import { ImCheckboxUnchecked } from 'react-icons/im';

export default function AdminAppMenu() {
  const {
    selectedPhotoIds,
    setSelectedPhotoIds,
  } = useAppState();

  const isSelecting = selectedPhotoIds !== undefined;

  return (
    <MoreMenu
      items={[{
        label: 'App Config',
        icon: <BiCog className="text-[17px]" />,
        href: PATH_ADMIN_CONFIGURATION,
      }, {
        label: isSelecting
          ? 'Exit Select'
          : 'Select Multiple',
        icon: isSelecting
          ? <FaTimes
            className="translate-y-[1px]"
          />
          : <ImCheckboxUnchecked
            className="text-[0.75rem] translate-y-[2px]"
          />,
        href: GRID_HOMEPAGE_ENABLED ? PATH_ROOT : PATH_GRID,
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
