import { generateAuthSecret } from '@/auth';
import SiteChecklistClient from './SiteChecklistClient';
import { CONFIG_CHECKLIST_STATUS } from '@/site/config';

export default async function SiteChecklist() {
  const secret = await generateAuthSecret();
  return (
    <SiteChecklistClient {...{
      ...CONFIG_CHECKLIST_STATUS,
      secret,
    }} />
  );
}
