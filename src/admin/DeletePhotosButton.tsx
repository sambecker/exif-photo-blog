'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import { batchPhotoAction } from '@/photo/actions';
import { useAppState } from '@/app/AppState';
import { toastSuccess, toastWarning } from '@/toast';
import { ComponentProps, useState } from 'react';
import DeleteButton from './DeleteButton';
import { PhotoQueryOptions } from '@/db';

export default function DeletePhotosButton({
  photoIds = [],
  photoOptions,
  photosText,
  onDelete,
  clearLocalState = true,
  onClick,
  onFinish,
  confirmText,
  toastText,
  ...rest
}: {
  photoIds?: string[]
  photoOptions?: PhotoQueryOptions
  photosText?: string
  onClick?: () => void
  onFinish?: () => void
  onDelete?: () => void
  clearLocalState?: boolean
  toastText?: string
} & ComponentProps<typeof LoaderButton>) {
  const [isLoading, setIsLoading] = useState(false);

  const { invalidateSwr, registerAdminUpdate } = useAppState();

  return (
    <DeleteButton
      {...rest}
      isLoading={isLoading}
      // eslint-disable-next-line max-len
      confirmText={confirmText ?? `Are you sure you want to delete ${photosText}? This action cannot be undone.`}
      onClick={() => {
        onClick?.();
        setIsLoading(true);
        batchPhotoAction({
          photoIds,
          photoOptions,
          action: 'delete',
        })
          .then(() => {
            toastSuccess(toastText ?? `${photosText} deleted`);
            if (clearLocalState) {
              invalidateSwr?.();
              registerAdminUpdate?.();
            }
            onDelete?.();
          })
          .catch(() => toastWarning(`Failed to delete ${photosText}`))
          .finally(() => {
            setIsLoading(false);
            onFinish?.();
          });
      }}
    />
  );
}
