import { Photo, PhotoDateRange } from '@/photo';
import SiteGrid from '@/components/SiteGrid';
import AnimateItems from '@/components/AnimateItems';
import PhotoGrid from '@/photo/PhotoGrid';
import TagHeader from './TagHeader';

export default function TagOverview({
  tag,
  photos,
  count,
  dateRange,
  showMorePath,
  animateOnFirstLoadOnly,
}: {
  tag: string,
  photos: Photo[],
  count: number,
  dateRange: PhotoDateRange,
  showMorePath?: string,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <SiteGrid
      contentMain={<div className="space-y-8 mt-4">
        <AnimateItems
          type="bottom"
          items={[
            <TagHeader
              key="TagHeader"
              {...{ tag, photos, count, dateRange }}
            />,
          ]}
          animateOnFirstLoadOnly
        />
        <PhotoGrid
          {...{ photos, tag, showMorePath, animateOnFirstLoadOnly }}
        />
      </div>}
    />
  );
}
