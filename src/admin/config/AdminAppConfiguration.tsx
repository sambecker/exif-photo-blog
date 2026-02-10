import { APP_CONFIGURATION } from '@/app/config';
import AdminAppConfigurationClient from './AdminAppConfigurationClient';

export default async function AdminAppConfiguration({
  simplifiedView,
}: {
  simplifiedView?: boolean
}) {
  return (
    <AdminAppConfigurationClient {...{
      ...APP_CONFIGURATION,
      simplifiedView,
    }} />
  );
}
