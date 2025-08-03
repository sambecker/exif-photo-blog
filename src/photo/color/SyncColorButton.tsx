'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import { IoColorFilterOutline } from 'react-icons/io5';
import {
  storeColorDataForAllPhotosAction,
  storeColorDataForPhotoAction,
} from '../actions';
import { useState } from 'react';

export default function SyncColorButton({
  photoId,
}: {
  photoId?: string
}) {
  const [isUpdatingColorData, setIsUpdatingColorData] = useState(false);

  return (
    <LoaderButton
      icon={<IoColorFilterOutline size={20} />}
      onClick={() => {
        setIsUpdatingColorData(true);
        (photoId
          ? storeColorDataForPhotoAction(photoId)
          : storeColorDataForAllPhotosAction())
          .finally(() => setIsUpdatingColorData(false));
      }}
      tooltip={photoId
        ? 'Update color data'
        : 'Update color data for all photos'}
      confirmText={!photoId
        ? 'Are you sure you want to update all photo color data?'
        : undefined}
      isLoading={isUpdatingColorData}
    />
  );
}
