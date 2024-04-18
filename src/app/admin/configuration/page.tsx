import ClearCacheButton from '@/admin/ClearCacheButton';
import InfoBlock from '@/components/InfoBlock';
import SiteGrid from '@/components/SiteGrid';
import SiteChecklist from '@/site/SiteChecklist';

export default async function AdminConfigurationPage() {
  return (
    <SiteGrid
      contentMain={
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="flex-grow">
              App Configuration
            </div>
            <ClearCacheButton />
          </div>
          <InfoBlock>
            <SiteChecklist />
          </InfoBlock>
        </div>}
    />
  );
}
