'use client';

import { FC } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Switcher from '@/components/switcher/Switcher';
import SwitcherItem from '@/components/switcher/SwitcherItem';
import { useSelection } from '@/selection/SelectionContext';
import { useAppText } from '@/i18n/state/client';
import { isPathSelected, PATH_SELECTED } from '@/app/path';

const SelectionMode: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    selectionMode,
    toggleSelectionMode,
    selectedPhotos,
    confirmSelection,
    clearSelection,
  } = useSelection();
  const appText = useAppText();

  if (selectionMode) {
    return (
      <div className='hidden sm:flex items-center'>
        <Switcher type='borderless'>
          <SwitcherItem
            className='px-3'
            width='auto'
            noPadding
            icon={<span>{appText.selected.confirm}</span>}
            onClick={async () => {
              const success = await confirmSelection();
              if (success) {
                router.refresh();
                router.push(PATH_SELECTED);
              }
            }}
            tooltip={{
              content: appText.selected.confirmTooltip,
            }}
          />
          <SwitcherItem
            className='px-3'
            width='auto'
            noPadding
            icon={<span>{appText.selected.cancel}</span>}
            onClick={() => {
              clearSelection();
              router.refresh();
            }}
            tooltip={{
              content: appText.selected.cancelTooltip,
            }}
          />
        </Switcher>
        <span className='text-dim ml-1 whitespace-nowrap'>
          ({selectedPhotos.length})
        </span>
      </div>
    );
  }

  if (isPathSelected(pathname)) {
    return null;
  }

  return (
    <Switcher type='borderless' className='hidden sm:flex'>
      <SwitcherItem
        className='px-3'
        width='auto'
        noPadding
        icon={<span>{appText.selected.select}</span>}
        onClick={() => toggleSelectionMode()}
        tooltip={{
          content: appText.selected.selectTooltip,
        }}
      />
    </Switcher>
  );
};

export default SelectionMode;
