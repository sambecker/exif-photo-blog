import ClearCacheButton from '@/admin/ClearCacheButton';
import AdminAppConfiguration from '@/admin/AdminAppConfiguration';
import AdminInfoPage from '@/admin/AdminInfoPage';

export default function AdminAppConfigurationPage() {
  return (
    <AdminInfoPage
      title="App Configuration"
      accessory={<ClearCacheButton />}
    >
      <AdminAppConfiguration />
    </AdminInfoPage>
  );
}
