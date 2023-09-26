import {
  getPhotosCached,
  getPhotosCountCached,
  getUniqueTagsCached,
} from '@/cache';
import AnimateItems from '@/components/AnimateItems';
import MorePhotos from '@/components/MorePhotos';
import SiteGrid from '@/components/SiteGrid';
import { generateOgImageMetaForPhotos, getPhotosLimitForQuery } from '@/photo';
import PhotoGrid from '@/photo/PhotoGrid';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { MAX_PHOTOS_TO_SHOW_HOME } from '@/photo/image-response';
import PhotoTag from '@/tag/PhotoTag';
import { Metadata } from 'next';

export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_HOME});
  return generateOgImageMetaForPhotos(photos);
}

export default async function GridPage({
  searchParams,
}: {
  searchParams: { next: string };
}) {
  const { offset, limit } = getPhotosLimitForQuery(searchParams.next);

  const [
    photos,
    count,
    tags,
  ] = await Promise.all([
    getPhotosCached({ limit }),
    getPhotosCountCached(),
    getUniqueTagsCached(),
  ]);

  const showMorePhotos = count > photos.length;
  
  return (
    photos.length > 0
      ? <SiteGrid
        contentMain={<div className="space-y-4">
          <PhotoGrid photos={photos} />
          {showMorePhotos &&
            <MorePhotos path={`/grid?next=${offset + 1}`} />}
        </div>}
        contentSide={tags &&
          <AnimateItems
            items={tags.map(tag => <PhotoTag key={tag} tag={tag} />)}
            staggerOnFirstLoadOnly
          />}
        sideHiddenOnMobile
      />
      : <PhotosEmptyState />
  );
}
