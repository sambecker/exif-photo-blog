import { Suspense } from 'react';
import { APP_CONFIGURATION } from '@/app-core/config';
import AdminAppConfigurationServer from './AdminAppConfigurationServer';
import AdminAppConfigurationClient from './AdminAppConfigurationClient';

export default function AdminAppConfiguration({
  simplifiedView,
}: {
  simplifiedView?: boolean
}) {
  return (
    <Suspense fallback={<AdminAppConfigurationClient {...{
      ...APP_CONFIGURATION,
      isAnalyzingConfiguration: true,
      simplifiedView,
    }} /> }>
      <AdminAppConfigurationServer {...{ simplifiedView }} />
    </Suspense>
  );
}
