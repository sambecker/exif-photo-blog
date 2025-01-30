import SiteChecklistClient from './SiteChecklistClient';
import {
  CONFIG_CHECKLIST_STATUS,
  VERCEL_GIT_REPO_OWNER,
  VERCEL_GIT_REPO_SLUG,
} from '@/site/config';
import { testConnectionsAction } from '@/admin/actions';
import { isRepoForkedFromBase } from '@/utility/github';

export default async function SiteChecklistServer({
  simplifiedView,
}: {
  simplifiedView?: boolean
}) {
  const connectionErrors = await testConnectionsAction().catch(() => ({}));
  const isForkedFromBaseRepo = await isRepoForkedFromBase(
    VERCEL_GIT_REPO_OWNER,
    VERCEL_GIT_REPO_SLUG,
  );

  return (
    <SiteChecklistClient {...{
      ...CONFIG_CHECKLIST_STATUS,
      ...connectionErrors,
      isForkedFromBaseRepo,
      simplifiedView,
    }} />
  );
}
