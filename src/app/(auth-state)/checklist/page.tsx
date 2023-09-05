import InfoBlock from '@/components/InfoBlock';
import SiteGrid from '@/components/SiteGrid';
import { SITE_CHECKLIST_STATUS } from '@/site';
import SiteChecklist from '@/site/SiteChecklist';

export default function ChecklistPage() {
  return (
    <SiteGrid
      contentMain={<InfoBlock>
        <SiteChecklist {...SITE_CHECKLIST_STATUS} />
      </InfoBlock>}
    />
  );
}
