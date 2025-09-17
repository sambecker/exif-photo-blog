import { Photo, PhotoDateRangePostgres } from '@/photo';
import PhotoGridContainer from '@/photo/PhotoGridContainer';
import FocalLengthHeader from './FocalLengthHeader';

export default function FocalLengthOverview({
  focal,
  photos,
  count,
  dateRange,
  animateOnFirstLoadOnly,
}: {
  focal: number,
  photos: Photo[],
  count: number,
  dateRange?: PhotoDateRangePostgres,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridContainer {...{
      cacheKey: `focal-${focal}`,
      photos,
      count,
      focal,
      header: <FocalLengthHeader {...{
        focal,
        photos,
        count,
        dateRange,
      }} />,
      animateOnFirstLoadOnly,
    }} />
  );
}
