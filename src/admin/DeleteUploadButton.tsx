'use client';

import { deleteUploadsAction } from '@/photo/actions';
import DeleteButton from './DeleteButton';
import { ComponentProps, useState } from 'react';
import LoaderButton from '@/components/primitives/LoaderButton';

export default function DeleteUploadButton({
  urls,
  onDeleteStart,
  onDelete,
  children,
  isLoading,
  ...props
}: {
  urls: string[]
  onDeleteStart?: () => void
  onDelete?: (didFail?: boolean) => void
} & ComponentProps<typeof LoaderButton>) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <DeleteButton
      {...props}
      confirmText={urls.length === 1
        ? 'Are you sure you want to delete this upload?'
        : `Are you sure you want to delete all ${urls.length} uploads?`}
      onClick={() => {
        onDeleteStart?.();
        setIsDeleting(true);
        deleteUploadsAction(urls)
          .then(() => {
            setIsDeleting(false);
            onDelete?.();
          })
          .catch(() => {
            setIsDeleting(false);
            onDelete?.(true);
          });
      }}
      isLoading={isLoading ?? isDeleting}
    >
      {children}
    </DeleteButton>
  );
}
