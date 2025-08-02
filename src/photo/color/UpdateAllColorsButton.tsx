'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import { IoColorFilterOutline } from 'react-icons/io5';
import { storeColorDataForAllPhotosAction } from '../actions';
import { useState } from 'react';

export default function UpdateAllColorsButton() {
  const [isUpdatingColorData, setIsUpdatingColorData] = useState(false);

  return (
    <LoaderButton
      icon={<IoColorFilterOutline size={20} />}
      onClick={() => {
        setIsUpdatingColorData(true);
        storeColorDataForAllPhotosAction()
          .finally(() => setIsUpdatingColorData(false));
      }}
      tooltip="Update all color data"
      confirmText="Are you sure you want to update all photo color data?"
      isLoading={isUpdatingColorData}
    />
  );
}
