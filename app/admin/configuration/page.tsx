import AdminAppConfiguration from '@/admin/AdminAppConfiguration';
import AdminInfoPage from '@/admin/AdminInfoPage';

export default function AdminAppConfigurationPage() {
  return (
    <AdminInfoPage page="Config">
      <AdminAppConfiguration />
    </AdminInfoPage>
  );
}
