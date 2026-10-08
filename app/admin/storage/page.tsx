import AdminPage from '@/admin/AdminPage';
import AdminStorageTable from '@/admin/storage/AdminStorageTable';
import { ADMIN_STORAGE_DEBUG_ENABLED } from '@/app/config';
import EnvVar from '@/components/EnvVar';

export default function AdminStoragePage() {
  return ADMIN_STORAGE_DEBUG_ENABLED
    ? <AdminStorageTable />
    : <AdminPage title="Storage" contained>
      <div>
        Set
        {' '}
        <EnvVar variable="ADMIN_STORAGE_DEBUG" />
        {' '}
        to {'"1"'} to enable
        storage checks
      </div>
    </AdminPage>;
}
