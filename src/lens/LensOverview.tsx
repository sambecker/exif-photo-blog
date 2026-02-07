import { Photo, PhotoDateRangePostgres } from '@/photo';
import { Lens, createLensKey } from '.';
import LensHeader from './LensHeader';
import PhotoGridContainer from '@/photo/PhotoGridContainer';

export default function LensOverview({
  lens,
  photos,
  count,
  dateRange,
  animateOnFirstLoadOnly,
}: {
  lens: Lens,
  photos: Photo[],
  count: number,
  dateRange?: PhotoDateRangePostgres,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridContainer {...{
      cacheKey: `lens-${createLensKey(lens)}`,
      photos,
      count,
      lens,
      animateOnFirstLoadOnly,
      header: <LensHeader {...{
        lens,
        photos,
        count,
        dateRange,
      }} />,
    }} />
  );
}
