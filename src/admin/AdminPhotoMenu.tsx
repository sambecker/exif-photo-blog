import { authCachedSafe } from '@/auth/cache';
import AdminPhotoMenuClient from './AdminPhotoMenuClient';
import { ComponentProps } from 'react';

export default async function AdminPhotoMenu(
  props: ComponentProps<typeof AdminPhotoMenuClient>,
) {
  const session = await authCachedSafe();
  return Boolean(session?.user?.email)
    ? <AdminPhotoMenuClient {...props} />
    : null;
}
