import { Photo, PhotoDateRangePostgres } from '@/photo';
import PhotoGridHybridContainer from '@/photo/PhotoGridHybridContainer';
import { Album } from '.';
import AlbumHeader from './AlbumHeader';

export default function AlbumOverview({
  album,
  photos,
  tags,
  count,
  dateRange,
  animateOnFirstLoadOnly,
}: {
  album: Album,
  photos: Photo[],
  tags: string[],
  count: number,
  dateRange?: PhotoDateRangePostgres,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridHybridContainer {...{
      cacheKey: `album-${album.slug}`,
      photos,
      count,
      album,
      header: <AlbumHeader {...{
        album,
        photos,
        tags,
        count,
        dateRange,
        showAlbumMeta: true,
      }} />,
      animateOnFirstLoadOnly,
    }} />
  );
}
