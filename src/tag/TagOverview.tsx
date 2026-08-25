import { Photo, PhotoDateRangePostgres } from '@/photo';
import TagHeader from './TagHeader';
import PhotoGridHybridContainer from '@/photo/PhotoGridHybridContainer';

export default function TagOverview({
  tag,
  photos,
  count,
  dateRange,
  animateOnFirstLoadOnly,
}: {
  tag: string,
  photos: Photo[],
  count: number,
  dateRange?: PhotoDateRangePostgres,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridHybridContainer {...{
      cacheKey: `tag-${tag}`,
      photos,
      count,
      tag,
      header: <TagHeader {...{
        tag,
        photos,
        count,
        dateRange,
      }} />,
      animateOnFirstLoadOnly,
    }} />
  );
}
