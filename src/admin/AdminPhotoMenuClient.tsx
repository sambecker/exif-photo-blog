'use client';

import { ComponentProps } from 'react';
import { pathForAdminPhotoEdit } from '@/site/paths';
import MoreMenu from '../components/MoreMenu';

export default function AdminPhotoMenuClient({
  photoId,
  ...props
}: Omit<ComponentProps<typeof MoreMenu>, 'items'> & {
  photoId: string
}) {
  return (
    <MoreMenu {...{
      items: [{ href: pathForAdminPhotoEdit(photoId), label: 'Edit Photo' }],
      ...props,
    }}/>
  );
}
