import InfoBlock from '@/components/InfoBlock';
import SiteGrid from '@/components/SiteGrid';
import SiteChecklist from '@/site/SiteChecklist';

export const runtime = 'edge';

export default async function AdminSettingsPage() {
  return (
    <SiteGrid
      contentMain={<InfoBlock>
        <SiteChecklist />
      </InfoBlock>}
    />
  );
}
