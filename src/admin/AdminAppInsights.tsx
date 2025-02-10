import { dateRangeForPhotos } from '@/photo';
import {
  getPhotosMeta,
  getUniqueCameras,
  getUniqueTags,
} from '@/photo/db/query';

export default async function AdminAppInsights() {
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
  
  return (
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
  );
}
