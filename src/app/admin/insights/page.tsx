import AdminInfoPage from '@/admin/AdminInfoPage';
import GitHubForkStatusBadge from '@/admin/github/GitHubForkStatusBadge';
import { dateRangeForPhotos } from '@/photo';
import {
  getPhotosMeta,
  getUniqueTags,
  getUniqueCameras,
} from '@/photo/db/query';
import { IS_DEVELOPMENT, IS_VERCEL_GIT_PROVIDER_GITHUB } from '@/site/config';

export default async function AdminInsightsPage() {
  const [
    { count, dateRange },
    tags,
    cameras,
  ]= await Promise.all([
    getPhotosMeta(),
    getUniqueTags(),
    getUniqueCameras(),
  ]);

  const { start, end } = dateRangeForPhotos(undefined, dateRange);

  return <AdminInfoPage
    title="App Insights"
    accessory={(IS_VERCEL_GIT_PROVIDER_GITHUB || IS_DEVELOPMENT) &&
      <GitHubForkStatusBadge />}
  >
    <div className="flex flex-col justify-center gap-4 *:text-center">
      <div className="font-bold uppercase text-main">
        Photo library
      </div>
      <div>
        {count} photos
      </div>
      <div>
        {tags.length} tags
      </div>
      <div>
        {cameras.length} cameras
      </div>
      <span className="text-dim uppercase">
        {start === end
          ? start
          : <>{end} – {start}</>}
      </span>
    </div>
  </AdminInfoPage>;
}
