'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import { batchPhotoAction } from '@/photo/actions';
import { useAppState } from '@/app/AppState';
import { toastSuccess, toastWarning } from '@/toast';
import { ComponentProps, useState } from 'react';
import DeleteButton from './DeleteButton';
import { PhotoQueryOptions } from '@/db';
import { useAppText } from '@/i18n/state/client';

export default function DeletePhotosButton({
  photoIds = [],
  photoOptions,
  photosText = '',
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

  const appText = useAppText();

  return (
    <DeleteButton
      {...rest}
      isLoading={isLoading}
      confirmText={
        confirmText ?? appText.admin.deletePhotosConfirm(photosText)
      }
      onClick={() => {
        onClick?.();
        setIsLoading(true);
        batchPhotoAction({
          photoIds,
          photoOptions,
          action: 'delete',
        })
          .then(() => {
            toastSuccess(
              toastText ?? appText.admin.deletePhotosSuccess(photosText),
            );
            if (clearLocalState) {
              invalidateSwr?.();
              registerAdminUpdate?.();
            }
            onDelete?.();
          })
          .catch(() =>
            toastWarning(appText.admin.deletePhotosFailure(photosText)))
          .finally(() => {
            setIsLoading(false);
            onFinish?.();
          });
      }}
    />
  );
}
