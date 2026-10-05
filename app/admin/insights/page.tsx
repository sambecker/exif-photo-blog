import AdminAppInsights from '@/admin/insights/AdminAppInsights';
import AdminInfoPage from '@/admin/AdminInfoPage';

export const dynamic = 'force-dynamic';

export default async function AdminInsightsPage() {
  return <AdminInfoPage>
    <AdminAppInsights />
  </AdminInfoPage>;
}
