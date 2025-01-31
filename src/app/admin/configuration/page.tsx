import ClearCacheButton from '@/admin/ClearCacheButton';
import GitHubForkStatusBadge from '@/admin/github/GitHubForkStatusBadge';
import Container from '@/components/Container';
import SiteGrid from '@/components/SiteGrid';
import { IS_DEVELOPMENT, IS_VERCEL_GIT_PROVIDER_GITHUB } from '@/site/config';
import SiteChecklist from '@/site/SiteChecklist';

export default async function AdminConfigurationPage() {
  return (
    <SiteGrid
      contentMain={
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="grow">
              App Configuration
            </div>
            {(IS_VERCEL_GIT_PROVIDER_GITHUB || IS_DEVELOPMENT) &&
              <GitHubForkStatusBadge />}
            <ClearCacheButton />
          </div>
          <Container spaceChildren={false}>
            <SiteChecklist />
          </Container>
        </div>}
    />
  );
}
