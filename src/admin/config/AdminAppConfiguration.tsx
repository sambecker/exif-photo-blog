import { Suspense } from 'react';
import { APP_CONFIGURATION } from '@/app/config';
import AdminAppConfigurationClient from './AdminAppConfigurationClient';
import AdminAppConfigurationServer from './AdminAppConfigurationServer';

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
