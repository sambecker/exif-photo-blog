import ClearCacheButton from '@/admin/ClearCacheButton';
import SiteChecklist from '@/site/SiteChecklist';
import AdminInfoPage from '@/admin/AdminInfoPage';

export default function AdminConfigurationPage() {
  return (
    <AdminInfoPage
      title="App Configuration"
      accessory={<ClearCacheButton />}
    >
      <SiteChecklist />
    </AdminInfoPage>
  );
}
