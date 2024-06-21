import ClearCacheButton from '@/admin/ClearCacheButton';
import Container from '@/components/Container';
import SiteGrid from '@/components/SiteGrid';
import SiteChecklist from '@/site/SiteChecklist';

export default async function AdminConfigurationPage() {
  return (
    <SiteGrid
      contentMain={
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex-grow">
              App Configuration
            </div>
            <ClearCacheButton />
          </div>
          <Container spaceChildren={false}>
            <SiteChecklist />
          </Container>
        </div>}
    />
  );
}
