'use client';

import { FC } from 'react';
import Switcher from '@/components/switcher/Switcher';
import SwitcherItem from '@/components/switcher/SwitcherItem';
import { useSelection } from '@/selection/SelectionContext';
import { PATH_SELECTED } from '@/app/path';
import { toast } from 'sonner';
import { useAppText } from '@/i18n/state/client';

const NoSelectionMode: FC = () => {
  const { selectionMode, selectedPhotos } = useSelection();
  const appText = useAppText();

  if (selectionMode || selectedPhotos.length === 0) {
    return null;
  }

  return (
    <Switcher type='borderless' className='hidden sm:flex pepeTrueno'>
      <SwitcherItem
        icon={
          <span className='whitespace-nowrap'>
            {appText.selected.selectedItem} ({selectedPhotos.length})
          </span>
        }
        href={PATH_SELECTED}
        onClick={() => toast.info(appText.selected.redirecting)}
        tooltip={{
          content: appText.selected.viewSelections,
        }}
        width='extended'
      />
    </Switcher>
  );
};

export default NoSelectionMode;
