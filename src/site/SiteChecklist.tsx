import { generateAuthSecret } from '@/auth';
import SiteChecklistClient from './SiteChecklistClient';
import { CONFIG_CHECKLIST_STATUS } from '@/site/config';

export default async function SiteChecklist({
  simplifiedView,
}: {
  simplifiedView?: boolean
}) {
  const secret = await generateAuthSecret();
  return (
    <>
      {process.env.VERCEL_URL}<br />
      {process.env.VERCEL_BRANCH_URL}<br />
      {process.env.VERCEL_PROJECT_PRODUCTION_URL}<br />
      {process.env.NEXT_PUBLIC_VERCEL_URL}<br />
      {process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}<br />
      {process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}<br />
      <SiteChecklistClient {...{
        ...CONFIG_CHECKLIST_STATUS,
        simplifiedView,
        secret,
      }} />
    </>
  );
}
