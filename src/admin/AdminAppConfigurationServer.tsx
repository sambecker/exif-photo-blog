import AdminAppConfigurationClient from './AdminAppConfigurationClient';
import { APP_CONFIGURATION } from '@/app-core/config';
import { testConnectionsAction } from '@/admin/actions';

export default async function AdminAppConfigurationServer({
  simplifiedView,
}: {
  simplifiedView?: boolean
}) {
  const connectionErrors = await testConnectionsAction().catch(() => ({}));

  return (
    <AdminAppConfigurationClient {...{
      ...APP_CONFIGURATION,
      ...connectionErrors,
      simplifiedView,
    }} />
  );
}
