'use client';

import { deleteUploadsAction } from '@/photo/actions';
import DeleteButton from './DeleteButton';
import { useRouter } from 'next/navigation';
import { PATH_ADMIN_PHOTOS } from '@/app/paths';
import { ComponentProps, useState } from 'react';
import LoaderButton from '@/components/primitives/LoaderButton';

export default function DeleteUploadButton({
  urls,
  shouldRedirectToAdminPhotos,
  onDeleteStart,
  onDelete,
  hideTextOnMobile,
  children,
  isLoading,
  ...props
}: {
  urls: string[]
  shouldRedirectToAdminPhotos?: boolean
  onDeleteStart?: () => void
  onDelete?: (didFail?: boolean) => void
} & ComponentProps<typeof LoaderButton>) {
  const router = useRouter();

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
            onDelete?.();
            if (shouldRedirectToAdminPhotos) {
              router.push(PATH_ADMIN_PHOTOS);
            } else {
              setIsDeleting(false);
            }
          })
          .catch(() => {
            setIsDeleting(false);
            onDelete?.(true);
          });
      }}
      isLoading={isLoading ?? isDeleting}
      hideTextOnMobile={hideTextOnMobile}
    >
      {children}
    </DeleteButton>
  );
}
