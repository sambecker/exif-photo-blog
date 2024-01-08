'use client';

import { ComponentProps } from 'react';
import { pathForAdminPhotoEdit } from '@/site/paths';
import MoreMenu from '../components/MoreMenu';

export interface AdminPhotoMenuClientProps
  extends ComponentProps<typeof MoreMenu> {
  photoId: string
}

export default function AdminPhotoMenuClient({
  photoId,
  className,
  buttonClassName,
}: AdminPhotoMenuClientProps) {
  return (
    <MoreMenu {...{
      items: [{ href: pathForAdminPhotoEdit(photoId), label: 'Edit Photo' }],
      className,
      buttonClassName,
    }}/>
  );
}
