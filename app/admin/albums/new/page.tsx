import AdminAlbumCreateClient from '@/admin/AdminAlbumCreateClient';
import { HAS_LOCATION_SERVICES } from '@/app/config';

export default function AdminAlbumCreatePage() {
  return (
    <AdminAlbumCreateClient hasLocationServices={HAS_LOCATION_SERVICES} />
  );
}
