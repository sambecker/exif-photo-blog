import SiteChecklistClient from './SiteChecklistClient';
import { CONFIG_CHECKLIST_STATUS } from '@/site/config';
import { testConnectionsAction } from '@/admin/actions';

export default async function SiteChecklistServer({
  simplifiedView,
}: {
  simplifiedView?: boolean
}) {
  const connectionErrors = await testConnectionsAction().catch(() => ({}));
  return (
    <SiteChecklistClient {...{
      ...CONFIG_CHECKLIST_STATUS,
      ...connectionErrors,
      simplifiedView,
    }} />
  );
}
