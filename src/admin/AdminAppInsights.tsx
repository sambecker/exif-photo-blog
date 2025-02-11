import { dateRangeForPhotos } from '@/photo';;
import {
  getPhotosMeta,
  getUniqueCameras,
  getUniqueTags,
} from '@/photo/db/query';
import clsx from 'clsx/lite';

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
    <div className={clsx(
      'flex flex-col items-center justify-center w-full gap-4',
      'mt-2 mb-6',
    )}>
      <div className="text-center text-main uppercase font-bold">
        Photo library
      </div>
      <div className={clsx(
        'grid grid-cols-2 gap-2 uppercase',
        'border border-main rounded-md p-4 bg-main shadow-xs',
        'w-[80%]',
      )}>
        <div className="tracking-wide">Photos</div>
        <div className="text-right">{count}</div>
        <div>Tags</div>
        <div className="text-right">{tags.length}</div>
        <div>Cameras</div>
        <div className="text-right">{cameras.length}</div>
        <span className="text-center col-span-2">
          {start === end
            ? start
            : <>{end} – {start}</>}
        </span>
      </div>
    </div>
  );
}
