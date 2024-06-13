import { Suspense } from 'react';
import { CONFIG_CHECKLIST_STATUS } from '@/site/config';
import SiteChecklistServer from './SiteChecklistServer';
import SiteChecklistClient from './SiteChecklistClient';

export default function SiteChecklist({
  simplifiedView,
}: {
  simplifiedView?: boolean
}) {
  return (
    <Suspense fallback={<SiteChecklistClient {...{
      ...CONFIG_CHECKLIST_STATUS,
      isTestingConnections: true,
      simplifiedView,
    }} /> }>
      <SiteChecklistServer {...{ simplifiedView }} />
    </Suspense>
  );
}
