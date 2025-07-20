import AdminAppConfiguration from '@/admin/config/AdminAppConfiguration';
import AdminAppConfigurationSidebar from
  '@/admin/config/AdminAppConfigurationSidebar';
import AdminInfoPage from '@/admin/AdminInfoPage';
import { APP_CONFIGURATION } from '@/app/config';
import { Suspense } from 'react';

export default function AdminAppConfigurationPage() {
  const { areInternalToolsEnabled } = APP_CONFIGURATION;
  return (
    <AdminInfoPage
      // Necessary because of useSearchParams usage in sidebar anchors
      contentSide={<Suspense>
        <AdminAppConfigurationSidebar
          {...{ areInternalToolsEnabled }}
        />
      </Suspense>}
    >
      <AdminAppConfiguration />
    </AdminInfoPage>
  );
}
