'use client';

import { ComponentProps } from 'react';
import { pathForAdminPhotoEdit } from '@/site/paths';
import MoreMenu from '../components/MoreMenu';

export interface AdminPhotoMenuClientProps
  extends Omit<ComponentProps<typeof MoreMenu>, 'items'> {
  photoId: string
}

export default function AdminPhotoMenuClient({
  photoId,
  ...props
}: AdminPhotoMenuClientProps) {
  return (
    <MoreMenu {...{
      items: [{ href: pathForAdminPhotoEdit(photoId), label: 'Edit Photo' }],
      ...props,
    }}/>
  );
}
