import AdminInfoPage from '@/admin/AdminInfoPage';
import GitHubForkStatusBadge from '@/admin/github/GitHubForkStatusBadge';
import { dateRangeForPhotos } from '@/photo';
import { getPhotosMetaCached } from '@/photo/cache';
import { IS_DEVELOPMENT, IS_VERCEL_GIT_PROVIDER_GITHUB } from '@/site/config';

export default async function AdminInsightsPage() {
  const { count, dateRange } = await getPhotosMetaCached();

  const { start, end } = dateRangeForPhotos(undefined, dateRange);

  return <AdminInfoPage
    title="App Insights"
    accessory={(IS_VERCEL_GIT_PROVIDER_GITHUB || IS_DEVELOPMENT) &&
      <GitHubForkStatusBadge />}
  >
    <div className="flex flex-col justify-center gap-4 *:text-center">
      <div>
        {count} photos
      </div>
      <span className="text-dim uppercase">
        {start === end
          ? start
          : <>{end} – {start}</>}
      </span>
    </div>
  </AdminInfoPage>;
}
