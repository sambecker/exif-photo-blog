import { Suspense } from 'react';
import { APP_CONFIGURATION } from '@/app/config';
import AdminAppConfigurationClient from './AdminAppConfigurationClient';
import AdminAppConfigurationServer from './AdminAppConfigurationServer';
import { generateAuthSecret } from '@/auth';

export default async function AdminAppConfiguration({
  simplifiedView,
}: {
  simplifiedView?: boolean
}) {
  const secret = await generateAuthSecret();
  return (
    <Suspense fallback={<AdminAppConfigurationClient {...{
      ...APP_CONFIGURATION,
      isAnalyzingConfiguration: true,
      secret,
      simplifiedView,
    }} /> }>
      <AdminAppConfigurationServer {...{ simplifiedView }} />
    </Suspense>
  );
}
