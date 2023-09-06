import InfoBlock from '@/components/InfoBlock';
import SiteGrid from '@/components/SiteGrid';
import SiteChecklist from '@/site/SiteChecklist';

export default async function ChecklistPage() {
  return (
    <SiteGrid
      contentMain={<InfoBlock>
        <SiteChecklist />
      </InfoBlock>}
    />
  );
}
