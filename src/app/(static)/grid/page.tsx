import {
  getPhotosCached,
  getPhotosCountCached,
  getUniqueCamerasCached,
  getUniqueTagsCached,
} from '@/cache';
import HeaderList from '@/components/HeaderList';
import SiteGrid from '@/components/SiteGrid';
import { generateOgImageMetaForPhotos } from '@/photo';
import PhotoCamera from '@/camera/PhotoCamera';
import PhotoGrid from '@/photo/PhotoGrid';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { MAX_PHOTOS_TO_SHOW_HOME } from '@/photo/image-response';
import { pathForGrid } from '@/site/paths';
import PhotoTag from '@/tag/PhotoTag';
import { Metadata } from 'next';
import { FaTag } from 'react-icons/fa';
import { IoMdCamera } from 'react-icons/io';
import {
  PaginationParams,
  getPaginationForSearchParams,
} from '@/site/pagination';

export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_HOME});
  return generateOgImageMetaForPhotos(photos);
}

export default async function GridPage({ searchParams }: PaginationParams) {
  const { offset, limit } = getPaginationForSearchParams(searchParams);

  const [
    photos,
    count,
    tags,
    cameras,
  ] = await Promise.all([
    getPhotosCached({ limit }),
    getPhotosCountCached(),
    getUniqueTagsCached(),
    getUniqueCamerasCached(),
  ]);

  const showMorePath = count > photos.length
    ? pathForGrid(offset + 1)
    : undefined;
  
  return (
    photos.length > 0
      ? <SiteGrid
        contentMain={<PhotoGrid {...{ photos, showMorePath }} />}
        contentSide={<div className="sticky top-4 space-y-4">
          {tags.length > 0 && <HeaderList
            title='Tags'
            icon={<FaTag size={12} />}
            items={tags.map(tag =>
              <PhotoTag
                key={tag}
                tag={tag}
                showIcon={false}
              />)}
          />}
          {cameras.length > 0 && <HeaderList
            title="Cameras"
            icon={<IoMdCamera size={13} />}
            items={cameras.map(({ cameraKey, camera }) =>
              <PhotoCamera
                key={cameraKey}
                camera={camera}
                showIcon={false}
                hideApple
              />)}
          />}
        </div>}
        sideHiddenOnMobile
      />
      : <PhotosEmptyState />
  );
}
