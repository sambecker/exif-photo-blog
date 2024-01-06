import InfoBlock from '@/components/InfoBlock';
import SiteGrid from '@/components/SiteGrid';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { syncCacheAction } from '@/photo/actions';
import SiteChecklist from '@/site/SiteChecklist';
import { BiTrash } from 'react-icons/bi';

export default async function AdminConfigurationPage() {
  return (
    <SiteGrid
      contentMain={
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="flex-grow">
              Blog Configuration
            </div>
            <form action={syncCacheAction}>
              <SubmitButtonWithStatus
                icon={<BiTrash />}
              >
                Clear Cache
              </SubmitButtonWithStatus>
            </form>
          </div>
          <InfoBlock>
            <SiteChecklist />
          </InfoBlock>
        </div>}
    />
  );
}
