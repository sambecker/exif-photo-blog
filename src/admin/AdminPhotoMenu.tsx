import { authCached } from '@/cache';
import AdminPhotoMenuClient, { AdminPhotoMenuClientProps }
  from './AdminPhotoMenuClient';

export default async function AdminPhotoMenu(props: AdminPhotoMenuClientProps) {
  const session = await authCached();
  return Boolean(session?.user?.email)
    ? <AdminPhotoMenuClient {...props} />
    : null;
}
