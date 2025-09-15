import { Photo, PhotoDateRangePostgres } from '@/photo';
import PhotoGridContainer from '@/photo/PhotoGridContainer';
import { Album } from '.';
import AlbumHeader from './AlbumHeader';

export default function AlbumOverview({
  album,
  photos,
  count,
  dateRange,
  animateOnFirstLoadOnly,
}: {
  album: Album,
  photos: Photo[],
  count: number,
  dateRange?: PhotoDateRangePostgres,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridContainer {...{
      cacheKey: `album-${album.slug}`,
      photos,
      count,
      album,
      header: <AlbumHeader {...{
        album,
        photos,
        count,
        dateRange,
        showAlbumMeta: true,
      }} />,
      animateOnFirstLoadOnly,
    }} />
  );
}
