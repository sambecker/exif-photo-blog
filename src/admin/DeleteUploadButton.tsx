'use client';

import { deleteUploadsAction } from '@/photo/actions';
import DeleteButton from './DeleteButton';
import { useRouter } from 'next/navigation';
import { PATH_ADMIN_PHOTOS } from '@/app/paths';
import { ReactNode, useState } from 'react';

export default function DeleteUploadButton({
  urls,
  shouldRedirectToAdminPhotos,
  onDelete,
  hideTextOnMobile,
  children,
  className,
}: {
  urls: string[]
  shouldRedirectToAdminPhotos?: boolean
  onDelete?: () => void
  hideTextOnMobile?: boolean
  children?: ReactNode
  className?: string
}) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <DeleteButton
      className={className}
      confirmText={urls.length === 1
        ? 'Are you sure you want to delete this upload?'
        : `Are you sure you want to delete all ${urls.length} uploads?`}
      onClick={() => {
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
          .catch(() => setIsDeleting(false));
      }}
      isLoading={isDeleting}
      hideTextOnMobile={hideTextOnMobile}
    >
      {children}
    </DeleteButton>
  );
}
