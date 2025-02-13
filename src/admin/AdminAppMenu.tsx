'use client';

import MoreMenu from '@/components/more/MoreMenu';
import {
  PATH_ADMIN_CONFIGURATION,
  PATH_ADMIN_INSIGHTS,
  PATH_GRID_INFERRED,
} from '@/app-core/paths';
import { useAppState } from '@/state/AppState';
import { BiCog } from 'react-icons/bi';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { IoCloseSharp } from 'react-icons/io5';
import AdminAppInsightsIcon from './AdminAppInsightsIcon';

export default function AdminAppMenu() {
  const {
    selectedPhotoIds,
    setSelectedPhotoIds,
  } = useAppState();

  const isSelecting = selectedPhotoIds !== undefined;

  return (
    <MoreMenu
      items={[{
        label: 'Insights',
        icon: <span className="scale-90 translate-y-[-3px]">
          <AdminAppInsightsIcon />
        </span>,
        href: PATH_ADMIN_INSIGHTS,
      }, {
        label: 'Configuration',
        icon: <BiCog className="text-[17px]" />,
        href: PATH_ADMIN_CONFIGURATION,
      }, {
        label: isSelecting
          ? 'Exit Select'
          : 'Select',
        icon: isSelecting
          ? <IoCloseSharp
            className="text-[18px] translate-y-[-0.5px]"
          />
          : <ImCheckboxUnchecked
            className="text-[0.75rem]"
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
