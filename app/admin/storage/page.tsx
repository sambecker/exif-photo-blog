import AdminInfoPage from '@/admin/AdminInfoPage';
import AdminStorageTable from '@/admin/storage/AdminStorageTable';
import { ADMIN_STORAGE_DEBUG_ENABLED } from '@/app/config';
import EnvVar from '@/components/EnvVar';

export default function AdminStoragePage() {
  return <AdminInfoPage>
    {ADMIN_STORAGE_DEBUG_ENABLED
      ? <AdminStorageTable />
      : <div>
        Set
        {' '}
        <EnvVar variable="ADMIN_STORAGE_DEBUG" />
        {' '}
        to {'"1"'} to enable
        storage checks
      </div>}
  </AdminInfoPage>;
}
