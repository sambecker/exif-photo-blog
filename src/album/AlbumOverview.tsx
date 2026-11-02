import { Photo, PhotoDateRangePostgres } from '@/photo';
import PhotoGridHybridContainer from '@/photo/PhotoGridHybridContainer';
import { Album } from '.';
import AlbumHeader from './AlbumHeader';
import EmptyState from '@/components/EmptyState';
import AppGrid from '@/components/AppGrid';
import IconPhoto from '@/components/icons/IconPhoto';

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
  const header = <AlbumHeader {...{
    album,
    photos,
    tags,
    count,
    dateRange,
    showAlbumMeta: true,
  }} />;

  return count === 0
    ? <div className="mt-1.5">
      {header}
      <AppGrid contentMain={
        <EmptyState icon={<IconPhoto />}>
          <div className="max-w-xs text-center space-y-1">
            <div className="font-bold">
              No photos yet!
            </div>
            <div className="text-dim">
              This album doesn&apos;t have any photos yet
            </div>
          </div>
        </EmptyState>
      } />
    </div>
    : <PhotoGridHybridContainer {...{
      cacheKey: `album-${album.slug}`,
      photos,
      count,
      album,
      header,
      animateOnFirstLoadOnly,
    }} />;
}
